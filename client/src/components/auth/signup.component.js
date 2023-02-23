import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from "../navbar.component";
import { SCHOOLS } from "./schoolList";

export default function SignupComponent () {
    const [formValue, setFormValue] = useState({
        schoolName: "",
        managerName: "",
        firstNumber: "",
        secondNumber: "",
        password: ""
    });

    const navigate = useNavigate();

    const renderSchoolList = (
        <datalist id="school-list">
            {SCHOOLS.map(function(school, i) {
                return <option value={school} key={i}/>
            })
            }
        </datalist>
    )

    const handleChange = (event) => {
        const { name, value } = event.target;
        const regexOnlyNumber = /^[0-9\b]+$/;
        const regexOnlyString = /^[ㄱ-ㅎ|가-힣|A-Z|a-z\b]+$/;

        setFormValue((prevState) => {
            if (name === "firstNumber" || name === "secondNumber") {
                if (value === '' || regexOnlyNumber.test(value)) {
                    return {
                        ...prevState,
                        [name]: value
                    }
                } 
                else {
                    return {
                        ...prevState,
                    }
                }
            }
            else if (name === "schoolName" || name === "managerName") {
                if (value === '' || regexOnlyString.test(value)) {
                    return {
                        ...prevState,
                        [name]: value
                    }
                } 
                else {
                    return {
                        ...prevState,
                    }
                }
            }
            else {
                return {
                    ...prevState,
                    [name]: value
                };
            }
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const isValidSchoolName = SCHOOLS.indexOf(formValue.schoolName);

        if (isValidSchoolName <= -1) {
            alert("회원가입 실패: 옳바른 학교명을 기입해주세요.");
            return;
        }

        const reqBody = {
            schoolName: formValue.schoolName,
            managerName: formValue.managerName.replace(/ /g, ''),
            directNumber: "032)" + formValue.firstNumber.replace(/ /g, '') + "-" + formValue.secondNumber.replace(/ /g, ''),
            password: formValue.password.replace(/ /g, '')
        }

        axios.post(
            '/api/auth/signup',
            reqBody,
            {'Content-Type': 'application/json', withCredentials: true}
        )
        .then((res) => {
            if (res.status !== 202) alert(res.data.message);
            else navigate("/");
        })
        .catch((err) => {
            alert(err.response.data.message);
        })
        
    }

    return (
        <div>
            <NavbarComponent />
            <section className="bg-white-200 min-h-screen flex items-center justify-center">
                <div className="bg-white-300 flex rounded-2xl shadow-lg w-3xl p-5 items-center w-screen-sm:xl">
                    <div className="px-2 md:px-4">
                        <h2 className="font-bold text-2xl text-[#000000]">회원가입</h2>

                        <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block mt-3 text-gray-700 text-sm font-bold ">
                                학교명
                                </label>

                                <input
                                    name="schoolName"
                                    list="school-list"
                                    value={formValue.schoolName}
                                    className="p-2 mt-1 rounded-xl border w-96 text-sm"
                                    autoComplete="off"
                                    placeholder="공식 학교명"
                                    onChange={handleChange}
                                    required
                                />
                                {renderSchoolList}
                
                            </div>

                            <div>
                                <label className="block mt-1 text-gray-700 text-sm font-bold ">
                                    담당교사 이름
                                </label>
                                <input
                                    className="p-2 mt-2 rounded-xl border w-96 text-sm"
                                    type="text"
                                    name="managerName"
                                    autoComplete="off"
                                    placeholder="이름"
                                    value={formValue.managerName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mt-1 text-gray-700 text-sm font-bold ">
                                    담당교사 직통번호
                                </label>

                                <div className="flex">
                                    <span className="mt-1 mr-1 p-1 ">032)</span>
                                    <input
                                    className="p-2 mt-1 rounded-xl border w-20 mr-1 text-sm"
                                    name="firstNumber"
                                    value = {formValue.firstNumber}
                                    autoComplete="off"
                                    maxLength={3}
                                    placeholder="앞 3자리"
                                    onChange={handleChange}
                                    required
                                    />
                                    <span className="mt-1 mr-1 p-1">-</span>
                                    <input
                                    className="p-2 mt-1 rounded-xl border w-20 ml-1 text-sm"
                                    name="secondNumber"
                                    value = {formValue.secondNumber}
                                    autoComplete="off"
                                    maxLength={4}
                                    placeholder="뒤 4자리"
                                    onChange={handleChange}
                                    required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="relative">
                                    <label className="block mt-1 text-gray-700 text-sm font-bold ">
                                        비밀번호
                                    </label>
                                        <input
                                        className="p-2 mt-1 rounded-xl border w-full text-sm"
                                        type="password"
                                        name="password"
                                        minLength={4}
                                        maxLength={16}
                                        placeholder="4~16자 영문 대 소문자, 숫자, 특수문자 중 최소 1개"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button className="bg-[#000000] rounded-xl text-white py-2 hover:scale-105 duration-300">
                                회원가입
                            </button>
                            

                        </form>

                        <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
                            <hr className="border-gray-400" />
                            <p className="text-center text-sm">OR</p>
                            <hr className="border-gray-400" />
                        </div>


                        <div className="mt-3 text-xs flex justify-between items-center text-[#000000]">
                            <p>이미 회원가입을 하셨나요?</p>
                            <button
                                className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
                                onClick={() => {
                                navigate("/signin");
                                }}
                            >
                                로그인
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}