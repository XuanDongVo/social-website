import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button } from "@mui/material";

const SwiperImage = ({ images }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [swiper, setSwiper] = useState(null);

    useEffect(() => {
        if (swiper) {
            // Cập nhật điều hướng khi Swiper đã được khởi tạo
            swiper.navigation.update();
        }
    }, [swiper]);

    return (
        <Box position="relative" width="100%">
            {images.length !== 1 && <Button ref={prevRef} sx={{
                position: "absolute", top: "42%", left: 0, zIndex: 10, color: 'black', "&:hover": {
                    backgroundColor: "unset",
                }
            }}>
                <ArrowBackIosIcon />
            </Button>}

            {/* Swiper */}
            <Swiper
                modules={[Navigation]}
                slidesPerView={1}
                onSwiper={setSwiper}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                style={{ width: "100%", height: "100%" }}
            >
                {images.map((url, index) => (
                    <SwiperSlide key={index}>
                        <Box component="img" src={url} alt={`Image ${index + 1}`} sx={{
                            width: "100%",
                            objectFit: "contain"
                        }} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {images.length !== 1 && <Button ref={nextRef} sx={{
                position: "absolute", top: "42%", right: 0, zIndex: 10, color: 'black', "&:hover": {
                    backgroundColor: "unset",
                }
            }}>
                <ArrowForwardIosIcon />
            </Button>
            }
        </Box>

    );
};

export default SwiperImage;
