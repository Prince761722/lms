import about from '../assets/images/about.png'
import HomeLayout from "../Layouts/homeLayout";

function AboutUs() {
    return (
        <HomeLayout>
            <div className="pl-20 pt-20 flex flex-col text-white">
                <div className="flex items-center gap-5 mx-10">
                    <section className="w-1/2 space-y-10">
                        <h1 className="text-yellow-500 text-5xl  font-bold ml-3">
                            Affordable and quality education
                        </h1>
                        <p>
                            Our goal is to provide the afoordable and quality eduction to the world.
                            We are a modern Learning Management System designed to deliver high-quality courses with a seamless user experience.
                            Our platform empowers learners with structured content, real-time progress tracking, and secure access.
                            Built with scalable technology, we aim to make online learning efficient, accessible, and engaging for everyone.

                        </p>
                    </section>

                    <div className="w-1/2">
                        <img
                            id="test1"
                            style={{
                                filter: "drop-shadow(0px 10px 10px rgb(0,0,0));"

                            }}
                            className="drop-shadow-2xl"
                            src={about} />
                    </div>
                </div>
                {/* <div className=" flex items-center justify-center mb-20  ">
                <div className=" carousel rounded-box w-[40%] h-100 gap-10">
                    <div className="carousel-item w-1/2">
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp"
                            className="w-full" />
                    </div>
                    <div className="carousel-item w-1/2">
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp"
                            className="w-full" />
                    </div>
                    <div className="carousel-item w-1/2">
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
                            className="w-full" />
                    </div>
                    <div className="carousel-item w-1/2">
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp"
                            className="w-full" />
                    </div>
                    <div className="carousel-item w-1/2">
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
                            className="w-full" />
                    </div>
                    <div className="carousel-item w-1/2">
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp"
                            className="w-full" />
                    </div>
                    <div className="carousel-item w-1/2">
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp"
                            className="w-full" />
                    </div>
                </div>
                </div> */}


            </div>


        </HomeLayout>

    );

}

export default AboutUs;