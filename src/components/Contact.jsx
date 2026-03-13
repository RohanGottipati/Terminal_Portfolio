import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { ComputersCanvas } from "./canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });

    if (error) setError("");
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!form.email.trim()) {
      setError("Please enter your email");
      return false;
    }
    if (!form.email.includes('@')) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!form.message.trim()) {
      setError("Please enter your message");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Rohan Gottipati",
          from_email: form.email,
          to_email: "rohan.gottipati@gmail.com",
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          setSuccess(true);
          setForm({
            name: "",
            email: "",
            message: "",
          });

          setTimeout(() => setSuccess(false), 5000);
        },
        (error) => {
          setLoading(false);
          console.error(error);
          setError("Something went wrong. Please try again or email me directly at rohan.gottipati@gmail.com");
        }
      );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 bg-black-200 rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 overflow-hidden"
        >
          {/* Left Column - Contact Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2 flex flex-col items-center justify-center"
          >
            <div className="w-full max-w-md">
              <p className="text-secondary text-sm uppercase tracking-wider text-center mb-2">Get in touch</p>
              <h3 className="text-white text-3xl font-bold text-center mb-8">Contact.</h3>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <Alert className="bg-green-500/20 border-green-500">
                    <AlertDescription className="text-green-400 text-center font-medium">
                      Thank you! I'll get back to you as soon as possible.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <Alert variant="destructive" className="bg-red-500/20 border-red-500">
                    <AlertDescription className="text-red-400 text-center font-medium">
                      {error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 w-full"
              >
                <label className="flex flex-col">
                  <span className="text-white font-medium mb-2">Your Name</span>
                  <Input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What's your good name?"
                    className="bg-tertiary py-3 px-5 placeholder:text-secondary text-white rounded-lg border-none font-medium"
                    required
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-white font-medium mb-2">Your email</span>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="What's your web address?"
                    className="bg-tertiary py-3 px-5 placeholder:text-secondary text-white rounded-lg border-none font-medium"
                    required
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-white font-medium mb-2">Your Message</span>
                  <Textarea
                    rows={6}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="What you want to say?"
                    className="bg-tertiary py-3 px-5 placeholder:text-secondary text-white rounded-lg border-none font-medium"
                    required
                  />
                </label>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-tertiary py-3 px-8 rounded-xl w-fit mx-auto text-white font-bold shadow-md shadow-primary hover:bg-opacity-80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send"}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Right Column - 3D PC Model */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-1/2 flex flex-col items-center justify-center"
          >
            <div className="w-full h-[320px] sm:h-[380px] lg:h-[420px] flex flex-col items-center justify-center overflow-hidden relative -ml-8">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-1 left-0 right-0 text-center z-10"
              >
                <p className="text-white text-sm font-medium opacity-90 bg-black-200 bg-opacity-50 px-3 py-1 rounded-full inline-block">
                  Feel free to interact with the setup!
                </p>
              </motion.div>

              <div className="w-full h-full flex items-center justify-center">
                <ComputersCanvas />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
