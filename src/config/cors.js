const allowlist = [
  "http://localhost:3000",
  "http://localhost:8000",
  "192.168.1.6",
  "https://quan-ly-giao-ly.vercel.app",
  "https://quan-ly-giao-ly-git-main-tlt14.vercel.app",
  "http://quan-ly-giao-50ssbl4qk-tlt14.vercel.app",
  "https://quan-ly-giao-ly.vercel.app"
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowlist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

module.exports = corsOptions;
