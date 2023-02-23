import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../logo.png";

export default function NavbarComponent( {signout} ) {
    const userData = sessionStorage.getItem("user");
    const navigate = useNavigate();

    const logoutHandler = (event) => {
        event.preventDefault();

        if (userData) {
            axios.post(
                "/api/auth/signout",
                null,
                {'Content-Type': 'application/json', withCredentials: true, }
            )
            .then(async (response) => {
                if (response.status === 202) {
                    signout();
                    sessionStorage.clear();
                    navigate("/");
                } else {
                    alert(response.data.message);
                }
            })
            .catch((error) => {
                alert(error.response.data.message);
            })

        } else {
            alert("세션이 만료 되었습니다. 재접속해주세요.");
        }
    }

    const topNavbar = (
        <div>
            <nav className="bg-white border-gray-200">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5">
                    <a href="/" className="flex items-center">
                        <img src={logo} className="h-6 mr-3 sm:h-9" alt="ice logo" />
                        <span className="self-container text-xl font-semibold whitespace-nowrap dark:text-gray">
                            학교로 찾아가는 노동인권교육
                        </span>
                    </a>
                </div>
            </nav>
        </div>
    )

    const bottomNavbar = (
        <div>
            <nav className="bg-neutral-700">
                <div className="max-w-screen-xl px-4 py-3 mx-auto md:px-6">
                    <div className="flex items-center">
                        <ul className="flex flex-row mt-0 mr-6 space-x-8 text-sm font-medium">
                            {
                                (userData === null)
                                ?
                                <>
                                <a className="text-neutral-700 hover:underline" aria-current="page">.</a>
                                </>
                                :
                                <>
                                    <li>
                                    <a href="/register" className="text-white dark:text-white hover:underline" aria-current="page">교육신청</a>
                                    </li>
                                    <li>
                                        <a href="/profile" className="text-white dark:text-white hover:underline">마이페이지</a>
                                    </li>
                                    <li>
                                        <a onClick={logoutHandler} href="/" className="text-white hover:underline">로그아웃</a>
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )

    return (
        <div>
            { topNavbar }
            { bottomNavbar }
        </div>
    )
}