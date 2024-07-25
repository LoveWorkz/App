#!/usr/bin/env bash

temp_name="temp3.csv"
xlsx2csv -d ";" --no-line-breaks "$1" $temp_name
english_file="en.json"
german_file="de.json"
portugal_file="pt.json"
echo "{" >$portugal_file
echo "{" >$english_file
echo "{" >$german_file

file_length=$(cat ${temp_name} | wc -l | tr -d ' ')
compare_length=$(cat compare.json | wc -l | tr -d ' ')
counter=0

echo "JSON LENGTH: ${compare_length}" | tr -d ' '
json_counter=1
# should_add_key_to_translations=0

while read -r json_line; do
    ((json_counter = json_counter + 1))

    if [[ $json_line == "}" ]]; then
        continue
    fi
    if [[ $json_line == "{" ]]; then
        continue
    fi

    json_key=$(echo "${json_line}" | cut -d ":" -f1 | sed "s/\"//g")
    json_value=$(echo "${json_line}" | cut -d ":" -f 2-200 | sed "s/,$//" | sed "s/\"//g" | tr '[:upper:]' '[:lower:]' | tr -d ' ')
    json_value_raw=$(echo "${json_line}" | cut -d ":" -f 2-200 | sed "s/,$//" | sed "s/\"//g")

    inner_counter=1

    echo "COMPARE JSON KEY: ${json_key}"

    while read -r line; do
        ((inner_counter = inner_counter + 1))
        # key=$(echo ${line} | cut -d ';' -f1)
        compare_key=$(echo ${line} | cut -d ';' -f1 | sed "s/\"//g")
        # echo "EXCEL KEY: ${compare_key}"
        # de_value=$(echo ${line} | cut -d ';' -f3 | sed "s/\"//g")
        # en_value=$(echo ${line} | cut -d ';' -f4 | sed "s/\"//g")
        # pt_value=$(echo ${line} | cut -d ';' -f5 | sed "s/\"//g")

        if [[ "$json_key" == "$compare_key" ]]; then
            # should_add_key_to_translations=0
            break
        # else
            # should_add_key_to_translations=1
            # echo
        fi

        # echo "inner: ${inner_counter}, length: ${file_length}"
        if [[ "$inner_counter" == "$file_length" ]]; then
            # if [[ $should_add_key_to_translations == 1 ]]; then
                # echo "$json_line" >>missing.json
                echo "Adding missing key \"${json_key}\": \"${json_value_raw}\""
                echo " \"${json_key}\": \"${json_value_raw}\"" >>missing.json
            # fi
            # should_add_key_to_translations=0
            json_counter=0
            inner_counter=1
            break
        fi

    done <"${temp_name}"


done < <(cat compare.json)

# while read -r line; do
#     ((counter = counter + 1))
#     key=$(echo ${line} | cut -d ';' -f1)
#     compare_key=$(echo ${line} | cut -d ';' -f1 | sed "s/\"//g")
#     de_value=$(echo ${line} | cut -d ';' -f3 | sed "s/\"//g")
#     en_value=$(echo ${line} | cut -d ';' -f4 | sed "s/\"//g")
#     pt_value=$(echo ${line} | cut -d ';' -f5 | sed "s/\"//g")

#     inner_counter=1
#     # json_counter=1
#     # should_add_key_to_translations=0

#     echo "COMPARE KEY: ${compare_key}"
#     # NOTE: checking if translation exist in xslx
#     while read -r json_line; do
#         ((inner_counter = inner_counter + 1))

#         if [[ $json_line == "}" ]]; then
#             continue
#         fi
#         if [[ $json_line == "{" ]]; then
#             continue
#         fi

#         compare_value=$(echo "$en_value" | tr '[:upper:]' '[:lower:]' | tr -d ' ')
#         json_key=$(echo "${json_line}" | cut -d ":" -f1 | sed "s/\"//g")
#         json_value=$(echo "${json_line}" | cut -d ":" -f 2-200 | sed "s/,$//" | sed "s/\"//g" | tr '[:upper:]' '[:lower:]' | tr -d ' ')

#         if [[ "$compare_value" == "$json_value" ]]; then
#             echo "${line};${json_key}" >>output.csv
#             inner_counter=0
#             break
#         fi

#         if [[ "$inner_counter" == "$compare_length" ]]; then
#             echo "line: ${counter} NOT FOUND, ${line}"
#             echo "$line" >>output.csv
#             inner_counter=0
#             break
#         fi
#     done < <(cat compare.json)

#     if [ -z "${key}" ]; then
#         continue
#     fi

#     if [ -z "${de_value}" ]; then
#         de_value="${key}, ${counter} missing translation"
#     fi

#     if [ -z "${en_value}" ]; then
#         en_value="${key}, ${counter} missing translation"
#     fi

#     if [ -z "${pt_value}" ]; then
#         pt_value="${key}, ${counter} missing translation"
#     fi

#     if ((counter == file_length)); then
#         echo "\"${key//\"/}\": \"${en_value}\"" >>$english_file
#         echo "\"${key//\"/}\": \"${de_value}\"" >>$german_file
#         echo "\"${key//\"/}\": \"${pt_value}\"" >>$portugal_file
#     else
#         echo "\"${key//\"/}\": \"${en_value}\"," >>$english_file
#         echo "\"${key//\"/}\": \"${de_value}\"," >>$german_file
#         echo "\"${key//\"/}\": \"${pt_value}\"," >>$portugal_file
#     fi

# done <"${temp_name}"

# echo "}" >>$portugal_file
# echo "}" >>$english_file
# echo "}" >>$german_file
