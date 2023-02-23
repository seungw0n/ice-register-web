import React, { useState, useLayoutEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../navbar.component";
import StudentRegisterComponent from "./student.register.component";
import AdultRegisterComponent from "./adult.register.component";

export default function RegisterComponent({ signin, signout }) {
    const [date, setDate] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [numStudentSlotLeft, setNumStudentSlotLeft] = useState(-1);
    const [numAdultSlotLeft, setNumAdultSlotLeft] = useState(-1);

    const navigate = useNavigate();

    useLayoutEffect(() => {
        async function fetchData(userDataJson) {
            try {
                const response = await axios.get(
                    "/api/auth/session",
                    { 'Content-Type': 'application/json', withCredentials: true }
                );
                if (response.status === 202) {
                    signin(userDataJson)
                }
            } catch (error) {
                alert(error.response.data.message);
                signout();
                navigate("/");
            }
        }

        const userData = sessionStorage.getItem("user");

        if (!userData) {
            signout();
            navigate("/")
        } else {
            const userDataJson = JSON.parse(userData);
            fetchData(userDataJson);
        }
    }, [])

    const handleChange = (event) => {
        setNumStudentSlotLeft(-1);
        setNumAdultSlotLeft(-1);
        setIsSearch(false);
        setDate(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (!date) {
            alert("날짜를 선택해주시기 바랍니다.")
            return;
        }

        axios.post(
            '/api/register/searchDate',
            {date: date},
            {'Content-Type': 'application/json', withCredentials: true}
        )
        .then((res) => {
            setNumStudentSlotLeft(res.data.data.numStudentSlotLeft);
            setNumAdultSlotLeft(res.data.data.numAdultSlotLeft);
            setIsSearch(true);
        })
        .catch((err) => {
            alert(err.response.data.message);
        })
    }

    return (
        <>
        <NavbarComponent signout={signout}/>
        <div className="flex items-center mt-5">
            <hr className="w-full border-t border-gray-300 mr-4" />
            <span className="text-gray-500 font-semibold flex whitespace-nowrap">
                신청 방법
            </span>
            <hr className="w-full border-t border-gray-300 ml-4" />
        </div>

        <div className="flex items-center mt-8">
            <div className="mx-auto bg-gray-100 p-8 rounded-lg max-w-screen-md">
                <p className="text-center text-red-800">
                    * 교육기간: 2023/05/02 - 2023/12/15 *
                </p>
                <p className="text-center text-red-800">
                    * 특성화고 신청기간: 2023/03/13 - 2023/03/17 *
                </p>
                <p className="text-center text-red-800">
                    * 일반학교 신청기간: 2023/03/15 - 2023/03/17 *
                </p>
                <br/>
                <p className="text-left text-gray-800">
                    - 원하는 날짜를 검색합니다.
                </p>
                <p className="text-left text-gray-800">
                    - 검색 결과를 확인 후 밑 신청서에 옳바른 값을 넣어 신청합니다.
                </p>
            </div>
        </div>

        <div className="flex items-center mt-5">
            <hr className="w-full border-t border-gray-300 mr-4" />
            <span className="text-gray-500 font-semibold flex whitespace-nowrap">
                날짜 검색
            </span>
            <hr className="w-full border-t border-gray-300 ml-4" />
        </div>
        
        <div className="flex justify-center items-center mt-8 mb-8">
            <form className="flex justify-center items-center flex-col sm:flex-row">
                <input
                    type="date"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-4 py-2 mb-4 sm:mb-0 sm:mr-4 w-full sm:w-auto"
                />
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-black hover:bg-gray-700 text-white py-2 px-4 rounded-xl w-full sm:w-auto"
                >
                    검색
                </button>
            </form>
        </div>

        {numStudentSlotLeft >= 0 &&
            <div className="flex items-center">
                <div className="mx-auto rounded-lg max-w-screen-md">
                    <p className="text-center text-gray-800">
                        날짜: {date}
                    </p>
                    <p className="text-center text-gray-800">
                        <label>신청가능 학급 수: </label>
                        <label className="text-red-800">{numStudentSlotLeft}</label>
                    </p>
                    <p className="text-center text-gray-800">
                        <label>신청가능 교원/학부모 수: </label>
                        <label className="text-red-800">{numAdultSlotLeft}</label>
                    </p>
                </div>
             </div>
        }
        

        <StudentRegisterComponent date={date} isSearch={isSearch}/>
        <AdultRegisterComponent date={date} isSearch={isSearch}/>
        </>
    )
}