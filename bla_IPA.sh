#!/bin/bash
DIR="$(cd "$(dirname "$1")" && pwd)"

function run {
	echo "Executing command: $@"
	$@
	if [[ $? != "0" ]]; then
		echo "Executing the above command has failed!"
		exit 1
	fi
}

function run_at {
	pushd $1
	shift
	run $@
	popd
}

function fir_upload {
	echo "fir upload log $1"
	ipaFile=${DIR}/${IPAName}
	fir publish "${ipaFile}" -c "$1"
}

function pgyer_upload {
	ipaFile=${DIR}/${IPAName}
	curl -F file=@"$ipaFile" \
	-F uKey=xxxx \
	-F _api_key=xxxx \
	-F updateDescription=$1 \
	https://www.pgyer.com/apiv1/app/upload
}

function read_updatelog {
	read -ep '请输入更新日志：' updateLog

	if [[ -z "$updateLog" ]]; then
		updateLog="更新"
		echo "建议输入更新日志"
	fi
	echo "updateLog $updateLog"
}

echo "==================MonkeyDev(create ipa file...)=================="

APP="$1"
DisplayName="$(/usr/libexec/PlistBuddy -c "Print CFBundleName" "${APP}/Info.plist")"
Version="$(/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" "${APP}/Info.plist")"
BuildCode="$(/usr/libexec/PlistBuddy -c "Print CFBundleVersion" "${APP}/Info.plist")"
IPAName="${DisplayName}_v${Version}_${BuildCode}.ipa"

run "rm -rf ${DIR}/${IPAName} ${DIR}/Payload"
run "mkdir ${DIR}/Payload"



run "cp -rf ${APP} ${DIR}/Payload"
# zip 用绝对路径压缩，会包含路径目录结构
run_at ${DIR} "zip -qr ${IPAName} Payload"
run "rm -rf ${DIR}/Payload"
echo "==================生成IPA成功: ${DIR}=================="


if [[ "$2" == "pgyer" ]]; then
	read_updatelog
	pgyer_upload "$updateLog"
elif [[ "$2" == "fir" ]]; then
	read_updatelog
	fir_upload "$updateLog"
else
	open ${DIR}
fi


# echo "==================BLA_IAP(done)=================="

exit;