import z from "zod";

// const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
export const emailSchema = z.string().email();

export const emailValidator = (email: string) => {
  if (!email || email.length === 0) {
    return "이메일을 입력해주세요.";
  }
  if (!email.includes("@")) {
    return '"@"를 반드시 포함해야합니다.';
  }

  //Todo: @ 뒤의 내용을 잘라서 세분화 하여 메세지를 디테일하게 작성할 수 있음.

  //   if (!emailRegex.test(email)) {
  //     return "잘못된 이메일 형식입니다.";
  //   }
  try {
    emailSchema.parse(email);
    return null;
  } catch (error: any) {
    return "잘못된 이메일 형식입니다.";
  }
};

export const passwordValidator = (password: string) => {
  const min = 6;
  const max = 18;
  const passwordSchema = z.string().min(min).max(max);

  if (!password || password.length === 0) {
    return "비밀번호를 입력해주세요.";
  }
  //   if (password.length < min) {
  //     return `비밀번호는 최소 ${min}자리입니다.`;
  //   }
  try {
    passwordSchema.parse(password);
    return null;
  } catch (error: any) {
    return `비밀번호는 ${min}~${max}자리입니다.`;
  }
};
