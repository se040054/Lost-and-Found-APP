// import { useState } from "react";
import Form from "react-bootstrap/Form";

export default function FormContainer ({
  children,
  //, handleSubmitExtend
}) {
  // const [validated, setValidated] = useState(false);

  // const handleSubmit = (event) => {
  //   const form = event.currentTarget;
  //   console.log("組件", form);
  //   event.preventDefault();
  //   event.stopPropagation();
  //    setValidated(true);
  //   handleSubmitExtend();
  // };

  return (
    <Form
      noValidate
      // validated={validated}
      // onSubmit={handleSubmit}
      style={{
        marginTop:'100px'
      }}
    >
      {children}
    </Form>
  );
}


