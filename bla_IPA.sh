#!/bin/bash -x
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
	ipaFile=${DIR}/Target.ipa
	fir publish "${ipaFile}" -c "$1"
}

function pgyer_upload {
	ipaFile=${DIR}/Target.ipa
	curl -F file=@"$ipaFile" \
	-F uKey=xxxx \
	-F _api_key=xxxx \
	-F updateDescription=$1 \
	https://www.pgyer.com/apiv1/app/upload
}

echo "==================MonkeyDev(create ipa file...)=================="


run "rm -rf ${DIR}/Target.ipa ${DIR}/Payload"
run "mkdir ${DIR}/Payload"

APP="$1"

run "cp -rf ${APP} ${DIR}/Payload"
# zip 用绝对路径压缩，会包含路径目录结构
run_at ${DIR} "zip -qr Target.ipa Payload"
run "rm -rf ${DIR}/Payload"

read -ep '请输入更新日志：' updateLog

if [[ -z "$updateLog" ]]; then
	updateLog="更新"
	echo "建议输入更新日志"
fi

if [[ "$2" == "pgyer" ]]; then
	pgyer_upload $updateLog
else
	fir_upload $updateLog
fi

echo "==================MonkeyDev(done)=================="

exit;