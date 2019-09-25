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

echo "==================MonkeyDev(create ipa file...)=================="


run "rm -rf ${DIR}/Target.ipa ${DIR}/Payload"
run "mkdir ${DIR}/Payload"

APP="$1"

run "cp -rf ${APP} ${DIR}/Payload"
# zip 用绝对路径压缩，会包含路径目录结构
run_at ${DIR} "zip -qr Target.ipa Payload"
run "rm -rf ${DIR}/Payload"

read -p '请输入更新日志：' updateLog

if [[ -n "$updateLog" ]]; then
	fir publish "${DIR}/Target.ipa" -c "$updateLog"
else
	echo "建议输入更新日志"
	fir publish "${DIR}/Target.ipa"
fi

echo "==================MonkeyDev(done)=================="

exit;