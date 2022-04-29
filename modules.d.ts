declare module "*.html" {
  const template: string;
  export default template;
}

declare module "*.module.css" {
  const styles: Record<string, string>;
  export default styles;
}
