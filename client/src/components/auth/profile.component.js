import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../navbar.component";

export default function ProfileComponent ({ signin, signout }) {

    const [ userInfos, setUserInfos ] = useState({
        schoolName: "",
        managerName: "",
        directNumber: "",
    });

    const [ reservations, setReservations ] = useState([]);

    const navigate = useNavigate();

    useLayoutEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(
                    "/api/user/getRegisterHistory",
                    { 'Content-Type': 'application/json', withCredentials: true }
                );
                if (response.status === 202) {
                    setReservations(response.data.data);
                }
            } catch (error) {
                alert(error.response.data.message);
                signout();
            }
        }
        const userData = sessionStorage.getItem("user");

        if (!userData) {
            signout();
            navigate("/");
        } else {
            fetchData();
            const userDataJson = JSON.parse(userData);

            signin(userDataJson);
            
            setUserInfos({
                schoolName: userDataJson.schoolName,
                managerName: userDataJson.managerName,
                directNumber: userDataJson.directNumber,
            });
        }

    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        
    }
    

    const renderReservation = (
        <>
            {reservations.map((reservation, i) => {
                let topic = "";
                let message = "";
                let sMessage = "";
                let aMessage = "";

                if (reservation.numStudentSlotNeed > 0) {
                    topic = "학생 신청 학급 수:"
                    message = reservation.grade + ", " + reservation.numStudentSlotNeed + "학급"
                } else {
                    topic = "교원/학부모 신청 수:"
                    message = reservation.grade + ", 1회"
                }

                return <div
                className="w-full sm:w-1/2 md:w-1/3 flex flex-col p-3"
                style={{ width: "20rem" }} 
                key={i}
                >
                    <div className="bg-blue rounded-lg shadow-lg overflow-hidden flex-1 flex flex-col">
                        <div className="p-4 flex-1 flex flex-col">
                        
                            <div className="relative h-8">
                                <div className="absolute top-0 right-0 h-10">
                                    <button
                                        type="button"
                                        class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                        onClick={handleSubmit}
                                    >
                                        <span class="sr-only">Close menu</span>
                                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4 text-grey-darker text-sm flex-1">
                                <h6>일시: </h6>
                                <input
                                className="p-2 mt-2 rounded-xl border w-full"
                                type="text"
                                value={reservation.date + " " + reservation.startTime + "~" + reservation.endTime}
                                readOnly
                                />
                            </div>
                            
                            <div className="mb-4 text-grey-darker text-sm flex-1">
                                <h6>{topic} </h6>
                                <input
                                className="p-2 mt-2 rounded-xl border w-full"
                                type="text"
                                value={message}
                                readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>
            })}
        </>
    );

    return (
        <>
            <NavbarComponent signout={signout} />
            <div className="antialiased text-gray-900 px-2 ">
                <div className="max-w-xl mx-auto py-2 divide-y md:max-w-4xl">
                    <div className="py-2">
                        <div className="mt-2 max-w-md">
                            <div className="grid grid-cols-1 gap-6">
                                <label className="block">
                                    <span className="text-black text-xl">
                                        학교명 : {userInfos.schoolName}
                                    </span>
                                </label>

                                <label className="block">
                                    <span className="text-black text-xl">
                                        담당교사 이름 : {userInfos.managerName}
                                    </span>
                                    {/* <input
                                        className="p-2 mt-2 rounded-xl border w-full"
                                        type="text"
                                        placeholder="Manager Name"
                                        required
                                    /> */}
                                </label>

                                <label className="block">
                                    <span className="text-black text-xl">
                                        담당교사 직통번호 : {userInfos.directNumber}
                                    </span>
                                    {/* <input
                                        className="p-2 mt-2 rounded-xl border w-full"
                                        type="text"
                                        placeholder="Manager Number"
                                        required
                                    /> */}
                                </label>

                                <label className="block">
                                    <span className="text-black text-xl">
                                        신청현황 : 
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap -m-3 justify-center">
                {reservations.length > 0 ? renderReservation : "아직 신청을하지 않으셨습니다."}
            </div>   
        </>
    );
}

