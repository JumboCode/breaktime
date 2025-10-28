import StaffSignup from "../components/StaffSignup"
import UserSignup from "../components/UserSignup"
import UserStaffToggle from "../components/UserStaffToggle";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen bg-indigo-purple font-all">
            {/* LHS - HEADING TEXT */}
            <div className="text-lime-500 flex flex-col w-1/2 pr-16 pt-[129px] pl-[118px]">
                <h1 className=" text-[120px] leading-none drop-shadow-lg drop-shadow-black">
                    <div>Book</div>
                    <div>Manage</div>
                    <div>Connect.</div>
                </h1>
                <p className="text-light-purple mt-12 text-[28px]">
                Create your account to connect, book services, and be part of our community
                </p>
                </div>
                {/* SIGNUP STYLE */}
                <div className="flex flex-col space-y-4 flex flex-col w-1/4 pt-[369px] mr-[118px]">
                    <h2 className="text-light-purple text-[28px]">
                        Let's get you started!
                    </h2>
                    <UserStaffToggle>
                    </UserStaffToggle>
                    <StaffSignup>
                    </StaffSignup>
                    <a className="text-light-purple uppercase underline hover:text-lime-500" href="">
                        Already have an account? Sign In
                    </a>
                </div>
        </div>
    );
}