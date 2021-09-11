get_abs_filename() {
  # $1 : relative filename
  echo "$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
}

a=`get_abs_filename $0`

#split by :
#array=(${string//:/ })

array=(${a//// })
unset '$array[-1]'
unset '$array[-1]'

for i in "${!array[@]}"
do
    echo "$i=>${array[i]}"
done

#cat >Dockerfile <<EOF
#FROM openjdk:8
#RUN mkdir -p /app
#WORKDIR /app
#COPY . /HelloWorld
#EOF

