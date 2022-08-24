import bcrypt from "bcrypt";

export const hash = async (text: string): Promise<string> => {
  const rounds = await bcrypt.genSalt(1024);
  return bcrypt.hash(text, rounds);
};

export const verifyHash = (
  text: string,
  compareHash: string
): Promise<boolean> => {
  const response = bcrypt.compare(text, compareHash);
  return response;
};
