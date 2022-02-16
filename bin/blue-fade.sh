#! /bin/sh
ifn="src/media/video/walden-sunset/012315408-sun-sets-over-walden-pond_Edited_Loop_crf_22.mp4"
ifnb="`basename \"${ifn}\" .mp4`"
pref="`basename $0 .sh`"

ffmpeg -y -i "${ifn}" -filter_complex "
[0:v]
colorchannelmixer=
0.360:0.000:0.000:0.000:
0.000:0.750:0.000:0.000:
0.000:0.000:0.820:0.000:
0.000:0.000:0.000:0.200
[v]" -map '[v]' -an "${pref}_${ifnb}.mp4"
