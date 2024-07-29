const onHandler = async () => {
  JSON.forEach(async rubric => {
    firestore()
      .collection('Categories_2')
      .doc(rubric.id)
      .set(rubric)
      .then(() => console.log('work'));
  });
};
