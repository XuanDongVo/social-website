import { useState, useEffect } from "react";
import { Avatar, Container, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "swiper/css";
import "swiper/css/navigation";
import "./Stories.css";

const stories = [
    { id: 1, user: "john_doe", image: "https://i.pravatar.cc/48?img=1" },
    { id: 2, user: "jane_smith", image: "https://i.pravatar.cc/48?img=2" },
    { id: 3, user: "mark_taylor", image: "https://i.pravatar.cc/48?img=3" },
    { id: 4, user: "alice_wonder", image: "https://i.pravatar.cc/48?img=4" },
    { id: 5, user: "bob_marley", image: "https://i.pravatar.cc/48?img=5" },
    { id: 6, user: "charlie", image: "https://i.pravatar.cc/48?img=6" },
    { id: 7, user: "david", image: "https://i.pravatar.cc/48?img=7" },
    { id: 8, user: "emma", image: "https://i.pravatar.cc/48?img=8" },
    { id: 9, user: "frank", image: "https://i.pravatar.cc/48?img=9" },
    { id: 10, user: "grace", image: "https://i.pravatar.cc/48?img=10" }
];

const Stories = () => {
    const [currentStory, setCurrentStory] = useState(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (currentStory !== null) {
            const timer = setTimeout(() => {
                if (index < stories.length - 1) {
                    setIndex((prev) => prev + 1);
                } else {
                    setCurrentStory(null);
                    setIndex(0);
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [currentStory, index]);

    return (
        <Container maxWidth="sm" className="stories-container">
            <div className="swiper-container">

                <Button
                    className="swiper-button-prev"
                    variant="contained"
                    sx={{
                        minWidth: 36,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        position: "absolute",
                        top: "50%",

                        transform: "translateY(-50%)",
                        backgroundColor: "white",
                        boxShadow: "none", // Loại bỏ bóng đổ
                        zIndex: 10,
                        "&:hover": {
                            backgroundColor: "white", // Không thay đổi màu khi hover
                            boxShadow: "none" // Giữ nguyên khi hover
                        }
                    }}
                >
                    <ArrowBackIosIcon fontSize="large" style={{ minWidth: "1rem", color: "black" }} />
                </Button>


                <Swiper
                    slidesPerView={6}
                    slidesPerGroup={4} // Di chuyển 4 stories mỗi lần click
                    spaceBetween={10}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev"
                    }}
                    modules={[Navigation]}
                    className="mySwiper"
                >
                    {stories.map((story) => (
                        <SwiperSlide key={story.id} >
                            <div className="story-item rainbow-border gap">
                                <Avatar
                                    src={story.image}
                                    sx={{ width: 60, height: 60, border: "3px solid white" }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <Button
                    className="swiper-button-next"
                    variant="contained"
                    sx={{
                        minWidth: 36,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        boxShadow: "none",
                        position: "absolute",
                        top: "50%",

                        transform: "translateY(-50%)",
                        backgroundColor: "white",
                        zIndex: 10,
                        "&:hover": {
                            backgroundColor: "white", // Không thay đổi màu khi hover
                            boxShadow: "none" // Giữ nguyên khi hover
                        }
                    }}
                >
                    <ArrowForwardIosIcon fontSize="large" style={{ minWidth: '1rem', color: 'black' }} />
                </Button>
            </div>

            {/* Story Viewer */}
            {currentStory && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
                    onClick={() => setCurrentStory(null)}
                >
                    <img src={stories[index].image} alt={stories[index].user} className="w-72 h-96 rounded-lg" />
                </div>
            )}
        </Container>
    );
};

export default Stories;
