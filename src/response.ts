import configure from "./configure";

const generate = (
  response: { data?: any; message?: string },
  templateType: string
) => {
  const ctx = {
    $data: JSON.stringify(response.data),
    $message: JSON.stringify(response.message),
  };
  const templates = configure.get('template');
  if (templates) {
    const template = templates[templateType];
    if (template) {
      return template.replace(/\$data|\$message/g, ($0) => {
        return ctx[$0] || "null";
      });
    }
  }
  return ctx.$data;
};

export default {
  generate
}