#!/usr/bin/env bash
# Copyright 2014 The Flutter Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.
# 基于flutter xcode_backend.sh 裁剪

# Exit on error
set -e

RunCommand() {
  echo "♦ $*"
  "$@"
  return $?
}

EchoError() {
  echo "$@" 1>&2
}

# Returns the CFBundleExecutable for the specified framework directory.即获取可执行文件mach-o
GetFrameworkExecutablePath() {
  local framework_dir="$1"

  local plist_path="${framework_dir}/Info.plist"
  local executable="$(defaults read "${plist_path}" CFBundleExecutable)"
  echo "${framework_dir}/${executable}"
}

# Destructively thins the specified executable file to include only the
# specified architectures.
LipoExecutable() {
  local executable="$1"
  shift
  # Split $@ into an array.
  read -r -a archs <<< "$@"

  # Extract architecture-specific framework executables.
  local all_executables=()
  for arch in "${archs[@]}"; do
    local output="${executable}_${arch}"
    local lipo_info="$(lipo -info "${executable}")"
    if [[ "${lipo_info}" == "Non-fat file:"* ]]; then
      if [[ "${lipo_info}" != *"${arch}" ]]; then
        echo "Non-fat binary ${executable} is not ${arch}. Running lipo -info:"
        echo "${lipo_info}"
        exit 1
      fi
    else
      if lipo -output "${output}" -extract "${arch}" "${executable}"; then
        all_executables+=("${output}")
      else
        echo "Failed to extract ${arch} for ${executable}. Running lipo -info:"
        RunCommand lipo -info "${executable}"
        exit 1
      fi
    fi
  done

  # Generate a merged binary from the architecture-specific executables.
  # Skip this step for non-fat executables.
  if [[ ${#all_executables[@]} > 0 ]]; then
    local merged="${executable}_merged"
    RunCommand lipo -output "${merged}" -create "${all_executables[@]}"

    RunCommand cp -f -- "${merged}" "${executable}" > /dev/null
    RunCommand rm -f -- "${merged}" "${all_executables[@]}"
  fi
}

# Destructively thins the specified framework to include only the specified
# architectures.
ThinFramework() {
  local framework_dir="$1"
  shift

  local executable="$(GetFrameworkExecutablePath "${framework_dir}")"
  LipoExecutable "${executable}" "$@"
}

ThinAppFrameworks() {
	# /Users/xxx/Library/Developer/Xcode/DerivedData/xxx-eroyxxjrcjopaxeizrrpugcufevn/Build/Products/Release-iphoneos/xxxxxx.app/Frameworks
  local xcode_frameworks_dir="${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}"
  	# 判断是否文件夹存在
  [[ -d "${xcode_frameworks_dir}" ]] || return 0
  find "${xcode_frameworks_dir}" -type d -name "*.framework" | while read framework_dir; do
    ThinFramework "$framework_dir" "$ARCHS"
  done
}


# Main entry point.
if [[ $# == 0 ]]; then
  EchoError "error: Param need！！！！！"
  exit -1
else
  case $1 in
    "thin")
      ThinAppFrameworks ;;
  esac
fi