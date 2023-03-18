import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdultRegisterComponent({ date, isSearch }) {
    const [ formValue, setFormValue ] = useState({
        grade: "교원",
        period: "1: 노동법의 배경과 구조",
        numTotalPeople: "",
        startTime: "",
        endTime: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
 
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
            if (formValue.numTotalPeople === "" || formValue.startTime === "" || formValue.endTime === "") {
                alert("모든 정보를 기입 후 신청해주시기 바랍니다.");
            } else {
                const reqBody = {
                    numTotalPeople: Number(formValue.numTotalPeople),
                    grade: formValue.grade,
                    date: date,
                    period: formValue.period,
                    startTime: formValue.startTime,
                    endTime: formValue.endTime
                }

                axios.post(
                    "/api/register/adult",
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
                교원/학부모 신청
            </span>
            <hr className="w-full border-t border-gray-300 ml-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <div className=" p-4 rounded-lg md:ml-20 border border-black">
                <label className="flex">
                    <span className="text-black text-lg mt-4">교원/학부모</span>
                    <div className="relative mt-4 ml-6">
                        <select
                            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                            name="grade"
                            onChange={handleChange}
                        >
                            <option>교원</option>
                            <option>학부모</option>
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
                <label className="flex">
                    <span className="text-black text-lg mt-4">주제</span>
                    <div className="relative mt-4 ml-6">
                        <select
                            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                            name="period"
                            onChange={handleChange}
                        >
                            <option>1: 노동법의 배경과 구조</option>
                            <option>2: 임금 및 노동시간</option>
                            <option>3: 청소년도 특수고용?</option>
                            <option>4: 아프니까 산재</option>
                            <option>5: 막말과 하대는 직장 내 괴롭힘</option>
                            <option>6: 제대로 퇴사하기</option>
                            <option>7: 법대로 하기</option>
                            <option>8: 청소년 노동의 이슈들</option>
                            <option>9: 노동인권관련 우리 사회 이슈</option>
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
                        신청 인원 수
                    </span>
                    <input
                        className="p-2 mt-2 rounded-xl border md:w-48  w-36 ml-6"
                        type="number"
                        name="numTotalPeople"
                        onChange={handleChange}
                        placeholder="모든 학교 필수"
                        required
                    />
                </label>

                <label className="flex">
                    <span className="text-black text-lg mt-4">시작 시간</span>
                    <input
                        className="p-2 mt-2 rounded-xl border md:w-48  w-36 ml-6"
                        type="time"
                        name="startTime"
                        onChange={handleChange}
                        placeholder="School name"
                        required
                    />
                </label>

                <label className="flex">
                    <span className="text-black text-lg mt-4">종료 시간</span>
                    <input
                        className="p-2 mt-2 rounded-xl border md:w-48  w-36 ml-6"
                        type="time"
                        name="endTime"
                        onChange={handleChange}
                        placeholder="School name"
                        required
                    />
                </label>
            </div>   
        </div>

        <div className="flex justify-center mt-6 mb-6">
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
    )
}