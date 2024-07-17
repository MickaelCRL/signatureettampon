interface Document {
  id?: string;
  name: string;
  url: string;
  hash: string;
  isSigned: boolean;
  envelope?: string;
}
