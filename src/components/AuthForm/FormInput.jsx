import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

export default function FormInput({
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
  invalidPrompt,
  minlength,
  maxlength,
  useRef,
}) {
  return (
    <Row>
      <Form.Group as={Col} md="12">
        <Form.Label htmlFor={id}>{label}</Form.Label>
        <Form.Control
          ref={useRef}
          className="mb-3 input-rows"
          id={id}
          type={type}
          placeholder={placeholder}
          defaultValue={value}
          value={value}
          onChange={(e) => {
            onChange?.(e);
          }}
          minLength={minlength}
          maxLength={maxlength}
        />
        <Form.Control.Feedback id={`${id}-feedback-valid`}>
          長度符合!
        </Form.Control.Feedback>
        <Form.Control.Feedback type="invalid" id={`${id}-feedback-invalid`}>
          {invalidPrompt}
        </Form.Control.Feedback>
      </Form.Group>
    </Row>
  );
}
