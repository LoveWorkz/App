#!/usr/bin/env bash

temp_name="temporary_translations.csv"

xlsx2csv -d ";" --no-line-breaks "$1" $temp_name

english_file="en_output.json"
german_file="de_output.json"
portugal_file="pt_output.json"
echo "{" >$portugal_file
echo "{" >$english_file
echo "{" >$german_file

file_length=$(cat ${temp_name} | wc -l | tr -d ' ')
counter=0

while read -r line; do
    ((counter = counter + 1))
    key=$(echo ${line} | cut -d ';' -f1)
    de_value=$(echo ${line} | cut -d ';' -f2 | sed "s/\"//g")
    en_value=$(echo ${line} | cut -d ';' -f3 | sed "s/\"//g")
    pt_value=$(echo ${line} | cut -d ';' -f4 | sed "s/\"//g")

    if [ -z "${key}" ]; then
        continue
    fi

    if [ -z "${de_value}" ]; then
        de_value="DE ${en_value},"
    fi

    if [ -z "${en_value}" ]; then
        en_value="${key}, ${counter} missing translation"
    fi

    if [ -z "${pt_value}" ]; then
        pt_value="PT ${en_value}"
    fi

    if ((counter == file_length)); then
        echo "\"${key//\"/}\": \"${en_value}\"" >>$english_file
        echo "\"${key//\"/}\": \"${de_value}\"" >>$german_file
        echo "\"${key//\"/}\": \"${pt_value}\"" >>$portugal_file
    else
        echo "\"${key//\"/}\": \"${en_value}\"," >>$english_file
        echo "\"${key//\"/}\": \"${de_value}\"," >>$german_file
        echo "\"${key//\"/}\": \"${pt_value}\"," >>$portugal_file
    fi

done <"${temp_name}"

echo "}" >>$portugal_file
echo "}" >>$english_file
echo "}" >>$german_file

rm ${temp_name}
