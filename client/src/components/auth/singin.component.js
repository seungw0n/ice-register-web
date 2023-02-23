import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../navbar.component";
import { SCHOOLS } from "./schoolList";

export default function SigninComponent ( {signin} ) {
    const [formValue, setFormValue] = useState({
        schoolName: "",
        password: ""
    });

    const navigate = useNavigate();
    
    const renderSchoolList = (
        <datalist id="school-list">
            { SCHOOLS.map(function(school, i) {
                return <option value={school} key={i}/>
            })
            }
        </datalist>
    )

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const isValidSchoolName = SCHOOLS.indexOf(formValue.schoolName);

        if (isValidSchoolName <= -1) {
            alert("학교명이 옳바르지 않습니다.");
            return;
        }

        axios.post(
            '/api/auth/signin',
            formValue,
            {'Content-Type': 'application/json', withCredentials: true}
        )
        .then((response) => {
            if (response.status !== 202) {
                alert(response.data.message);
            } else { // signin ok
                // console.log(typeof response.data.data, response.data.data); // OBJECT
                const userData = response.data.data;

                sessionStorage.setItem("user", JSON.stringify(userData));
                signin(userData);

                navigate("/profile")
                return;
            }
        })
        .catch((error) => {
            alert(error.response.data.message);
        })
    }

    return (
        <>
            <NavbarComponent />
            <section className="bg-white-200 min-h-screen flex items-center justify-center">
                <div className="bg-white-300 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
                    <div className="px-2 md:px-10">
                        <h2 className="font-bold text-2xl text-[#000000]">로그인</h2>

                        <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>

                        <div>
                            <label className="block mt-3 text-gray-700 text-sm font-bold ">
                            
                            </label>
                            <input
                            className="p-2 rounded-xl border w-80"
                            list="school-list"
                            type="text"
                            name="schoolName"
                            placeholder="학교명"
                            onChange={handleChange}
                            autoComplete="off"
                            required
                            />
                            {renderSchoolList}
                        </div>

                        <div className="relative">
                            <label className="block mt-1 text-gray-700 text-sm font-bold ">
                            
                            </label>
                            <input
                            className="p-2 rounded-xl border w-full"
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            onChange={handleChange}
                            required
                            />
                        </div>

                        <button className="bg-[#000000] rounded-xl text-white py-2 hover:scale-105 duration-300">
                            로그인
                        </button>

                        <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
                            <hr className="border-gray-400" />
                            <p className="text-center text-sm">OR</p>
                            <hr className="border-gray-400" />
                        </div>

                        <div className="mt-3 text-xs flex justify-between items-center text-[#000000]">
                            <p>아직 가입을 안 하셨나요?</p>
                            <button
                                className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
                                onClick={() => {
                                navigate("/signup");
                                }}
                            >
                                회원가입
                            </button>
                        </div>

                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}