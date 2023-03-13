import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentRegisterComponent({ date, isSearch }) {
    const [formValue, setFormValue] = useState({
        numStudentSlotNeed: "",
        numTotalPeople: "",
        numMale: "0",
        numFemale: "0",
        grade: "초 5학년", // 학년 can be selected 5, 6, 1, 2, 3
        period: "1-2", // 교시
        startTime: "",
        endTime: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        // const regexOnlyNumber = /^[0-9\b]+$/;

        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value
            }
        });
        
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!date || date === "" || !isSearch) {
            alert("날짜 검색을 먼저 하신 후 신청바랍니다.");
        } else {
            if (formValue.numStudentSlotNeed === "" || formValue.numTotalPeople === "" || formValue.startTime === "" || formValue.endTime === "") {
                alert("모든 정보를 기입 후 신청해주시기 바랍니다.");
            } else {
                const reqBody = {
                    numStudentSlotNeed: Number(formValue.numStudentSlotNeed),
                    numTotalPeople: Number(formValue.numTotalPeople),
                    numMale: Number(formValue.numMale),
                    numFemale: Number(formValue.numFemale),
                    grade: formValue.grade,
                    date: date,
                    period: formValue.period,
                    startTime: formValue.startTime,
                    endTime: formValue.endTime
                }

                axios.post("/api/register/student",
                    reqBody,
                    {'Content-Type': 'application/json', withCredentials: true}
                )
                .then((res) => {
                    alert("신청 되었습니다.");
                    window.location.reload(false);
                })
                .catch((error) => {
                    alert(error.response.data.message);
                    window.location.reload(false);
                })
            }
        }
    }

    return (
        <>
        <div className="flex items-center mt-8">
            <hr className="w-full border-t border-gray-300 mr-4" />
            <span className="text-gray-500 font-semibold flex whitespace-nowrap">
                학생 신청
            </span>
            <hr className="w-full border-t border-gray-300 ml-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <div className="p-4 rounded-lg md:ml-20 border border-black">
                <label className="flex">
                    <span className="text-black text-lg mt-4">학년</span>
                    <div className="relative mt-4 ml-6">
                        <select 
                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        name="grade"
                        onChange={handleChange}
                        >
                            <option>초 5학년</option>
                            <option>초 6학년</option>
                            <option>중 1학년</option>
                            <option>중 2학년</option>
                            <option>중 3학년</option>
                            <option>고 1학년</option>
                            <option>고 2학년</option>
                            <option>고 3학년</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            >
                                <path d="M14.707 7.293a1 1 0 0 0-1.414 0L10 10.586 6.707 7.293a1 1 0 0 0-1.414 1.414l3.707 3.707a1 1 0 0 0 1.414 0l3.707-3.707a1 1 0 0 0 0-1.414z" />
                            </svg>
                        </div>
                    </div>
                </label>
            </div>

            <div className=" p-4 rounded-lg border md:mr-20 border-black">
                <label className="flex">
                    <span className="text-black text-lg mt-4">
                    총 신청 학생 수
                    </span>
                    <input
                    className="p-2 mt-2 rounded-xl border md:w-48  w-36 ml-6"
                    type="number"
                    onChange={handleChange}
                    name="numTotalPeople"
                    placeholder="모든 학교 필수"
                    required
                    />
                </label>

                <label className="flex">
                    <span className="text-black text-lg mt-4">신청 남학생 수</span>
                    <input
                    className="p-2 mt-2 rounded-xl border w-48 ml-6"
                    type="number"
                    onChange={handleChange}
                    name="numMale"
                    placeholder="직업계고 필수"
                    />
                </label>

                <label className="flex">
                    <span className="text-black text-lg mt-4">신청 여학생 수</span>
                    <input
                    className="p-2 mt-2 rounded-xl border w-48 ml-6"
                    type="number"
                    onChange={handleChange}
                    name="numFemale"
                    placeholder="직업계고 필수"
                    />
                </label>
            </div>

            <div className=" p-4 rounded-lg md:ml-20 border border-black">
                <label className="flex">
                    <span className="text-black text-lg mt-4">교시</span>
                    <div className="relative mt-4 ml-6">
                        <select
                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        onChange={handleChange}
                        name="period"
                        >
                            <option>1-2</option>
                            <option>2-3</option>
                            <option>3-4</option>
                            <option>4-5</option>
                            <option>5-6</option>
                            <option>6-7</option>
                            <option>7-8</option>
                            <option>8-9</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            >
                                <path d="M14.707 7.293a1 1 0 0 0-1.414 0L10 10.586 6.707 7.293a1 1 0 0 0-1.414 1.414l3.707 3.707a1 1 0 0 0 1.414 0l3.707-3.707a1 1 0 0 0 0-1.414z" />
                            </svg>
                        </div>
                    </div>
                </label>
            </div>

            <div className=" p-4 rounded-lg md:mr-20 border border-black">
                <label className="flex">
                    <span className="text-black text-lg mt-4">
                        총 신청 학급 수
                    </span>
                    <input
                        className="p-2 mt-2 rounded-xl border md:w-48  w-36 ml-6"
                        type="number"
                        onChange={handleChange}
                        name="numStudentSlotNeed"
                        placeholder="모든 학교 필수"
                        required
                    />
                </label>

                <label className="flex">
                    <span className="text-black text-lg mt-4">시작 시간</span>
                    <input
                        className="p-2 mt-2 rounded-xl border md:w-48  w-36 ml-6"
                        type="time"
                        onChange={handleChange}
                        name="startTime"
                        placeholder="School name"
                        required
                    />
                </label>

                <label className="flex">
                    <span className="text-black text-lg mt-4">종료 시간</span>
                    <input
                        className="p-2 mt-2 rounded-xl border md:w-48  w-36 ml-6"
                        type="time"
                        onChange={handleChange}
                        name="endTime"
                        placeholder="School name"
                        required
                    />
                </label>
            </div>   
        </div>

        <div className="flex justify-center mt-6">
            <div>
                <button
                    className="bg-black sm:w-48 hover:bg-gray-700 text-white py-2 px-4 rounded-xl"
                    onClick={handleSubmit}    
                >
                    신청
                </button>
            </div>
        </div>

        </>
    );

}