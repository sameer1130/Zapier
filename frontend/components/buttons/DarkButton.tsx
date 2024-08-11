import { ReactNode } from "react"


export const DarkButton = ({children, onClick, size = "small"}: {
    children: ReactNode,
    onClick: ()=> void,
    size?: "big" | "small"
}) =>{
    return <div onClick={ onClick} className={`${size=== "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-8 py-2 " : "px-10 py-3"} flex flex-col justify-center cursor-pointer hover:shadow-md bg-purple-700 text-white rounded text-center`}>
        {children}
    </div>
}