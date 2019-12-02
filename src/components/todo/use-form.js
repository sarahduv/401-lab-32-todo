import { useState } from 'react';

function useForm(queuePublish, socketEmit) {
  let [item, setItem] = useState({});

  const handleInputChange = e => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  return [item, handleInputChange];

  //   const handleSubmit = e => {
  //     e.preventDefault();
  //     e.target.reset();
  //     socketEmit('words', values);
  //     queuePublish('deeds', 'work', values);
  //   };

  //   const handleChange = e => {
  //     setValues({ ...values, [e.target.name]: e.target.value });
  //   };

  //   return [values, handleChange, handleSubmit];
}

export default useForm;
