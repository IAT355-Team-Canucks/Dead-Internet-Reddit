
import { motion } from 'motion/react'

// Components
import { VerticalBarChart } from "../../components/VerticalBarChart"
import { AnimatedLineChart } from '../../components/AnimatedLineChart'
import { ScatterPlot } from '../../components/ScatterPlot'
import { RadarChart } from '../../components/RadarChart'


export const DemoSlide = () => {

    return (
        <>
            <section id="center">
                <h1>Sample Components Board</h1>
                <div>
                    <ScatterPlot />
                    <VerticalBarChart />

                    <RadarChart />

                    { /* Motion Wrappers */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                        <AnimatedLineChart />
                    </motion.div>

                    <p>
                        You've reached the end! Wow!
                    </p>
                </div>
            </section>
            <section id="spacer"></section>
        </>
    )
}