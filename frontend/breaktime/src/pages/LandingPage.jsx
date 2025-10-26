import StaffSignup from "../components/StaffSignup"
import UserSignup from "../components/UserSignup"

export default function LandingPage() {
    return (
        <div className="flex min-h-screen bg-indigo-purple font-all">
            {/* LHS - HEADING TEXT */}
            <div className="text-lime-500 flex flex-col justify-center w-1/2 px-16">
                <h1 className="text-[70px] leading-none">
                <div>Book</div>
                <div>Manage</div>
                <div>Connect</div>
                </h1>
                <p className="text-light-purple mt-4">
                Create your account to connect, book services, and be part of our community
                </p>
                </div>
                {/* SIGNUP STYLE */}
                <div className="flex flex-col space-y-4 flex flex-col 
                                justify-center w-1/2 px-16 font-al"
                >
                    <h2 className="text-light-purple text-[28px]">
                        Let's get you started!
                    </h2>
                    <StaffSignup></StaffSignup>
                </div>
        </div>
    );
}