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
                alert("세션이 완료되었습니다. 다시 로그인해주세요.")
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
            window.location.reload(false);
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
                <p className="text-center text-gray-800 font-serif">
                    「2023학년도 학교로 찾아가는 노동인권교육」 신청 안내
                </p>
                <br/>
                <p className="text-left text-gray-800 font-serif">
                    가. 교육기간: 20232.5.2.(월) ~ 2022.12.15.(금)
                </p>
                <br/>
                <p className="text-left text-gray-800 font-serif">
                    나. 신청기간
                </p>
                <p className="text-left text-gray-800 font-serif">
                    1) 학생
                </p>
                <p className="text-left text-gray-800 font-serif">
                    -특성화고, 산업수요맞춤형고: 3.20(월)~3.24(금)
                </p>
                <p className="text-left text-gray-800 font-serif">
                    -초·중·일반고·특수: 3.22(수)~3.24(금)
                </p>
                <p className="text-left text-gray-800 font-serif">
                    ※ 참고: 3.20~3.21, 2일간은 직업계고만 신청가능함.
                </p>
                <br/>
                <p className="text-left text-gray-800 font-serif">
                    2) 학부모/교원: 3.20(월)~3.24(금)
                </p>
                <br/>
                <p className="text-left text-gray-800 font-serif font-bold">
                    희망 날짜 검색 후 보이는 '잔여학급 수' 만큼 신청가능합니다.
                </p>
            </div>
        </div>

        <div className="flex items-center mt-5">
            <hr className="w-full border-t border-gray-300 mr-4" />
            <span className="text-gray-500 font-semibold flex whitespace-nowrap">
                희망 날짜 검색
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