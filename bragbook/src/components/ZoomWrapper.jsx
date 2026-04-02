// ZoomWrapper.jsx 
//This wrapper component is for the ZUI animation styling for the webpage using Framer motion.
//ANy element that is wrapped with this can be Zoomed in/out smoothely.
//Use this for the brag cards, login/logout, etc.


import { motion, AnimatePresence }  from 'framer-motion' //

//Accepts 3 props:
// *children: the content to be wrapped and animated
// *isZoomed: boolrsn that controls whether the element is zoomed in or out
// *onClick: call function that calls when the element is clicked. Can be used to toggle zoom.
const ZoomWrapper = ({ children, isZoomed, onClick}) => {
    return (
        // *AnimatePresence: Allows Components to animate when they are added or removed from the react component tree.
        <AnimatePresence>
            <motion.div
                onClick={onClick}
                
                // Starts at the beginning, before any interaction
                initial={{ scale: 1 }}

                // When isZoomed is true, scale up to 1.5x
                // When isZoomed is false, return to intial scale 1x
                animate={isZoomed ? { scale: 1.5 } : { scale: 1}}

                // Return to initial scale when component is removed from the tree
                exit={{ scale: 1 }}

                // Controls the speed and feel of the animation. Feel free to change the duration to either speed up or slow down.
                transition={{ duration: 0.35, ease: 'easeOut' }}

                // Sets the Zoom origin to the center of the element so that it scales from the middle rather than the top left corner
                style={{ originX: '50%', originY: '50%'}}
            >
                {/* Renders whatever content is passed into this wrapper*/}
                {children}
            </motion.div>
        </AnimatePresence>
    )
} 

export default ZoomWrapper