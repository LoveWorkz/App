#!/usr/bin/env bash

# temp_name="temp2.csv"
# xlsx2csv -d ";" --no-line-breaks "$1" $temp_name

# # touch test.json
# # temp_name="temp.csv"
# # xlsx2csv "$1" "${temp_name}"

# english_file="en.json"
# german_file="de.json"
# portugal_file="pt.json"

# echo "{" > $portugal_file
# echo "{" > $english_file
# echo "{" > $german_file


# file_length=$(cat ${temp_name}|wc -l)
# counter=0

# while read -r line; do
#     ((counter = counter + 1))
#     key=$(echo ${line} |cut -d ';' -f1)
#     de_value=$(echo ${line} |cut -d ';' -f3| sed "s/\"//g")
#     en_value=$(echo ${line} |cut -d ';' -f4| sed "s/\"//g")
#     pt_value=$(echo ${line} |cut -d ';' -f5| sed "s/\"//g")

#     if [ -z "${key}" ];then
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
#         echo "\"${key//\"/}\": \"${en_value}\"" >> $english_file
#         echo "\"${key//\"/}\": \"${de_value}\"" >> $german_file
#         echo "\"${key//\"/}\": \"${pt_value}\"" >> $portugal_file
#     else
#         echo "\"${key//\"/}\": \"${en_value}\"," >> $english_file
#         echo "\"${key//\"/}\": \"${de_value}\"," >> $german_file
#         echo "\"${key//\"/}\": \"${pt_value}\"," >> $portugal_file
#     fi

# done < "${temp_name}"

# echo "}" >> $portugal_file
# echo "}" >> $english_file
# echo "}" >> $german_file
# # rm "${temp_name}"
