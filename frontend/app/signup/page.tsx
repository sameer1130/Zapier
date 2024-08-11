"use client"

import { Appbar } from "@/components/Appbar";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";


export default function() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return <div>
        <Appbar />
        <div className="flex justify-center">
            <div className="flex pt-8 max-w-4xl">
                <div className="flex-1 pt-20 px-4">
                    <div className="font-semibold text-3xl pb-4">
                        Join Millions worldwide who automate their work using Zapier!!!
                    </div>
                    <div className="pb-6 pt-4">
                        <CheckFeature label={"Easy Setup No Coding"}/>
                    </div>
                    <div className="pb-6">
                        <CheckFeature label={"Free forever for its core feature"}/>
                    </div>
                    <div className="pb-6">
                        <   CheckFeature label={"14-day Trial of premium features & apps"}/>
                    </div>
                </div>
                <div className="flex-1 pt-12 pb-12 mt-12 border rounded px-4">
                    <Input label= {"Name"}  onChange={e => {
                        setName(e.target.value);
                    }} type="text" placeholder="Your Name"></Input>
                    <Input label= {"Email"} onChange={e => {
                        setEmail(e.target.value)
                    }} type="text" placeholder="Email"></Input>
                    <Input label= {"Password"} onChange={e => {
                        setPassword(e.target.value)
                    }} type="password" placeholder="Password"></Input>
                    <div className="pt-8">
                        <PrimaryButton onClick = { async() => {
                            const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
                                username: email,
                                password,
                                name
                            })
                            router.push("/login");
                        }}size="big">Get Started Free</PrimaryButton>
                    </div>
                </div>
            
            </div>
        </div>
    </div>
}