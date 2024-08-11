

export const Feature = ({title, subtitle}:{
    title: string,
    subtitle: string
}) => {
    return <div className="flex"> 
        <Check></Check>
        <div className="flex flex-col justify-center pl-1">
            <div className="flex">
                <div className="pr-1 font-bold text-sm">
                    {title}
                </div>
                <div className="pr-4 text-sm">
                    {subtitle}
                </div>
            </div>
        </div>
    </div>
}

function Check() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
  
}