
// import { motion } from 'motion/react'

// Components
import { VerticalBarChart } from "../../components/VerticalBarChart"
import { ScatterPlot } from '../../components/ScatterPlot'
import { RadarChart } from '../../components/RadarChart'
import { HorizontalBoxPlot } from '../../components/HorizontalBoxPlot'
import { VerticalBoxPlot } from '../../components/VerticalBoxPlot'
import { HexbinPlot } from "../../components/HexbinPlot"

export const DemoSlide = () => {

    return (
        <>
            <section id="center">
                <h1>Sample Components Board</h1>
                <div>
                <HexbinPlot
                        title="Account Age vs Karma"
                        xKey="account_age_days"
                        yKey="user_karma"
                        xLabel="Account Age"
                        yLabel="User Karma"
                        hexRadius={22}
                        annotations={[]}
                        canAnimate={true}
                        />
                    <HexbinPlot
                        title="Word Length vs User Karma"
                        xKey="avg_word_length"
                        yKey="user_karma"
                        xLabel="Average Word Length"
                        yLabel="User Karma"
                        hexRadius={14}
                        annotations={[]}
                        canAnimate={true}
                        />
                    <ScatterPlot />
                    <VerticalBoxPlot />
                    <HorizontalBoxPlot />
                    <VerticalBarChart />

                    <RadarChart />

                    { /* Motion Wrappers */}
                    {/* <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                        <AnimatedLineChart />
                    </motion.div> */}

                    <p>
                        You've reached the end! Wow!
                    </p>
                </div>
            </section>
            <section id="spacer"></section>
        </>
    )
}