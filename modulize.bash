#!/bin/bash
set -eo pipefail
PROJECT_VERSION=$(node -p "require('./package.json').version")
PORJECT_NAME=$(node -p "require('./package.json').name")
PORJECT_AUTHOR=$(node -p "require('./package.json').author")
# makes sure the folder containing the script will be the root folder
cd "$(dirname "$0")" || exit

. ./.env

# Colors for printing messages
NC='\033[0m' # No Color
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'

print_info() {
  echo -e "${GREEN} [ info ] ${NC}" "$1"
}

print_error() {
  echo -e "${RED} [ error ] ${NC}" "$1" >&2
}

usage() {
  print_error "Usage: $(basename "$0") [-e ENV] [-p PHASE] [-m MODULE]"
  print_error "   - mandatory: -p PHASE"
  print_error "   - mandatory: -e ENV"
  print_error "   - optional:  -m MODULE"
  exit 1
}

print_header() {
  echo "================================================"
  echo -e "   Modulize Project Automation v1.7.0"
  echo -e "   Prj. Name: ${BLUE}${PORJECT_NAME}${NC}"
  echo -e "   Prj. Version: ${BLUE}${PROJECT_VERSION}${NC}"
  echo -e "   Prj. Author:  ${BLUE}${PORJECT_AUTHOR}${NC}"
  echo "================================================"
}

# Parse command-line options
while getopts ":m:p:e:" opt; do
  case $opt in
  m) MODULE="$OPTARG" ;;
  p) PHASE="$OPTARG" ;;
  e) ENV="$OPTARG" ;;
  *) usage ;;
  esac
done

# Shift the options and arguments so that $1 refers to the first non-option argument
shift $((OPTIND - 1))

print_header
# Validate command-line options
if [[ -z $PHASE ]]; then
  usage
fi
if [[ -z $ENV ]]; then
  ENV=dev
fi

# Set NODE_ENV to the specified environment
NODE_ENV=$ENV
export $NODE_ENV
print_info "Running in ${BLUE} ${NODE_ENV} ${NC} mode"

init() {
  phase() {
    local PHASE_PATH=${1}
    local PHASE_NAME=${2}
    local PHASE_DIR=${3}

    if [[ -f "${PHASE_PATH}/scripts/${PHASE_NAME}.bash" ]]; then
      print_info "${PHASE_NAME}ing ${BLUE}${PHASE_DIR}${NC}"
      bash "${PHASE_PATH}/scripts/${PHASE_NAME}.bash" -e $ENV

      # Print a message indicating that the module has been installed and how long it took
      print_info "${PHASE_NAME}ed ${BLUE}${PHASE_DIR}${NC}"
    fi
  }

  local PROJECT_MODULES=("${INSTALL_PROJECT_MODULES[@]}")

  if [[ $PHASE == "clean" ]] || [[ $PHASE == "uninstall" ]]; then
    PROJECT_MODULES=("${UNINSTALL_PROJECT_MODULES[@]}")
  fi

  init_submodules() {
    for i in "${PROJECT_MODULES[@]}"; do
      local MODULE_DIR=./${i}
      # Find all submodules inside the module directory and save them to an array
      local SUBMODULES=($(find "${MODULE_DIR}" -mindepth 1 -maxdepth 1 -type d -exec basename {} \;))

      # Loop through the array and print each directory
      for DIR in "${SUBMODULES[@]}"; do
        if [[ "$DIR" == "scripts" ]]; then
          phase ./${i} ${PHASE} ${i}
        fi
        if [[ ! -f "./${i}/.env" ]]; then
          phase ./${i}/${DIR} ${PHASE} ${DIR}
        fi
      done

      if [[ -f "./${i}/.env" ]]; then
        . "./${i}/.env"

        for j in "${INSTALL_MODULE_SUBPROJECTS[@]}"; do
          phase ./${i}/${j} ${PHASE} ${j}
        done
      else
        local SUBMODULES=($(find "./${i}" -mindepth 1 -maxdepth 1 -type d -exec basename {} \;))
        for DIR in "${SUBMODULES[@]}"; do
          phase ./${i}/${DIR} ${PHASE} ${DIR}
        done
      fi
    done
  }

  if [[ -n "${MODULE}" ]]; then
    # Loop through the PROJECT_MODULES array and check if the MODULE exists
    for i in "${PROJECT_MODULES[@]}"; do
      if [[ "$i" = "${MODULE}" ]]; then
        # if the MODULE exists then execute the PHASE script
        phase ./${MODULE} ${PHASE} ${MODULE}
        exit 0
      fi
      # if the MODULE does not exist, check each existing module if there is an existing MODULE inside
      local MODULE_DIR=./${i}
      # Find all submodules inside the module directory and save them to an array
      local SUBMODULES=($(find "${MODULE_DIR}" -mindepth 1 -maxdepth 1 -type d -exec basename {} \;))
      # Loop through the array and print each directory
      for DIR in "${SUBMODULES[@]}"; do
        # If any of the submodules is the same as the specified module, execute phase script
        if [[ "${DIR}" == "${MODULE}" ]]; then
          phase ./${i}/${DIR} $PHASE $MODULE
        fi
      done
    done
  else
    print_info "No module selected - Running ${BLUE}${PHASE} ${NC}in${BLUE} ${NODE_ENV}${NC} enviorment on all modules"
    init_submodules
  fi
}

init
