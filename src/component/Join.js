import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import firebase from "../firebase";

function Join() {
  const { register, handleSubmit, watch, errors } = useForm({
    mode: "onChange",
  });
  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  const [loading, setLoading] = useState(false);

  const password = useRef();
  password.current = watch("password");
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);

      await createdUser.user.updateProfile({
        displayName: data.name,
      });
      //Firebase 데이터베이스에 저장해주기
      await firebase.database().ref("users").child(createdUser.user.uid).set({
        name: createdUser.user.displayName,
        call_number: data.call_number,
        email: data.email,
        role: 0,
      });
      setLoading(false);
    } catch (error) {
      setErrorFromSubmit(error.message);
      setTimeout(() => {
        setErrorFromSubmit("");
        setLoading(false);
      }, 3000);
    }
  };

  watch("name");
  watch("email");
  watch("call_number");
  watch("password");
  watch("password2");

  const [InputName, setInputName] = useState(false);
  const [InputEmail, setInputEmail] = useState(false);
  const [InputPhone, setInputPhone] = useState(false);
  const [InputPw, setInputPw] = useState(false);
  const [InputPw2, setInputPw2] = useState(false);

  const onInputName = (e) => {
    setInputName(e.target.value);
  };
  const onInputEmail = (e) => {
    setInputEmail(e.target.value);
  };
  const onInputPw = (e) => {
    setInputPw(e.target.value);
  };
  const onInputPw2 = (e) => {
    setInputPw2(e.target.value);
  };

  return (
    <>
      <div className="join-form-wrap">
        <form className="join-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-box">
            <input
              type="text"
              onChange={onInputName}
              name="nick"
              id="nick"
              ref={register({ required: true })}
            />
            <label
              htmlFor="nick"
              className={"place-holder " + (InputName && "on")}
            >
              <span>닉네임</span>
            </label>
            {errors.nick && errors.nick.type === "required" && (
              <p>닉네임을 입력해 주세요</p>
            )}
          </div>
          <div className="input-box">
            <input
              name="email"
              type="email"
              id="email"
              onChange={onInputEmail}
              ref={register({ required: true, pattern: /^\S+@\S+$/i })}
            />
            <label
              htmlFor="email"
              className={"place-holder " + (InputEmail && "on")}
            >
              <span>이메일</span>
            </label>
            <span
              style={{
                color: "#888",
                fontSize: "12px",
                display: "block",
                paddingLeft: "10px",
                marginTop: "3px",
              }}
            >
              ※ 실제 사용중인 이메일로 가입 바랍니다(비밀번호 재설정 시 필요)
            </span>
            {errors.email && errors.email.type === "required" && (
              <p>이메일을 입력해 주세요</p>
            )}
            {errors.email && errors.email.type === "pattern" && (
              <p>이메일 형식이 맞지 않습니다.</p>
            )}
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              id="password"
              onChange={onInputPw}
              ref={register({ required: true, minLength: 6 })}
            />
            <label
              htmlFor="password"
              className={"place-holder " + (InputPw && "on")}
            >
              <span>비밀번호</span>
            </label>
            {errors.password && errors.password.type === "required" && (
              <p>비밀번호를 입력해 주세요</p>
            )}
            {errors.password && errors.password.type === "minLength" && (
              <p>비밀번호는 최소 6글자이상 이어야 합니다.</p>
            )}
          </div>
          <div className="input-box">
            <input
              type="password"
              name="password2"
              id="password2"
              onChange={onInputPw2}
              ref={register({
                required: true,
                validate: (value) => value === password.current,
              })}
            />
            <label
              htmlFor="password2"
              className={"place-holder " + (InputPw2 && "on")}
            >
              <span>비밀번호 확인</span>
            </label>
            {errors.password2 && errors.password2.type === "required" && (
              <p>비밀번호 확인을 입력해 주세요</p>
            )}
            {errors.password2 && errors.password2.type === "validate" && (
              <p>비밀번호가 일치하지 않습니다.</p>
            )}
            {errorFromSubmit && <p>{errorFromSubmit}</p>}
          </div>
          <input type="submit" value="회원가입" disabled={loading} />
        </form>
      </div>
    </>
  );
}

export default Join;
