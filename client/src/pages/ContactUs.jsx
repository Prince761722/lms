import { useState } from "react";
import axiosInstance from "../helpers/axiosInstance";
import toast from "react-hot-toast";
import HomeLayout from "../Layouts/homeLayout";

function ContactUs() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const promise = axiosInstance.post("/contact", formData);

      toast.promise(promise, {
        loading: "Sending message...",
        success: (res) => res.data.message,
        error: (err) =>
          err?.response?.data?.message || "Failed to send message"
      });

      await promise;

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-14 flex items-center justify-center">

        <div className="w-full max-w-5xl">

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-10 text-center">
            Contact{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              Us
            </span>
          </h1>

          {/* Card */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-xl shadow-black/40">

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >

              {/* Name */}
              <div className="flex flex-col">
                <label className="text-white/50 text-sm mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 outline-none focus:border-yellow-500/40 focus:ring-1 focus:ring-yellow-500/30 transition-all"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-white/50 text-sm mb-1">Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 outline-none focus:border-yellow-500/40 focus:ring-1 focus:ring-yellow-500/30 transition-all"
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-white/50 text-sm mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 outline-none focus:border-yellow-500/40 focus:ring-1 focus:ring-yellow-500/30 transition-all"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-white/50 text-sm mb-1">Message</label>
                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 outline-none focus:border-yellow-500/40 focus:ring-1 focus:ring-yellow-500/30 transition-all resize-none"
                ></textarea>
              </div>

              {/* Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/20 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </HomeLayout>
  );
}

export default ContactUs;