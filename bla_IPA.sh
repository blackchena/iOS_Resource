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
run_at ${DIR} "zip -qr Target.ipa Payload"
run "rm -rf ${DIR}/Payload"

fir publish "${DIR}/Target.ipa"

echo "==================MonkeyDev(done)=================="

exit;