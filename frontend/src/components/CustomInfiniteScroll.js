import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const CustomInfiniteScroll = (props) => {
  useEffect(() => {
    // Target all elements with the infinite-scroll-component class
    const infiniteScrollComponents = document.querySelectorAll(
      ".infinite-scroll-component"
    );

    infiniteScrollComponents.forEach((component) => {
      component.style.overflow = "visible"; // Override overflow style
    });
  }, []);

  return <InfiniteScroll {...props}>{props.children}</InfiniteScroll>;
};

export default CustomInfiniteScroll;
