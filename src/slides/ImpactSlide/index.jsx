import { useViewport } from "../../context/ViewportContext"

import { PieChart } from "../../components/PieChart"

export const ImpactSlide = () => {
    const { isDesktop } = useViewport()
    return (
        <section>
  <main
    style={{
      flex: 1,
      paddingLeft: "3rem",
      paddingRight: "3rem",
      maxWidth: "100%",
      position: "relative",
      boxSizing: "border-box",
      height: "auto",
    }}
  >
    <div
      style={{
        display: "flex",
        maxWidth: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "2rem",
        flexWrap: "wrap", // important
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          margin: 0,
          gap: 0,
          justifyContent: "center",
          height: "auto",
          flex: "1 1 500px", // flexible text column
          minWidth: 0, // important in flex layouts
        }}
      >
        <p
          style={{
            fontSize: "1.5rem",
            color: "#EAC46A",
            maxWidth: isDesktop ? "70%" : "90%",
          }}
        >
          According to Reddit’s Transparency Report (2025), close to 6 billion
          pieces of content was shared on the platform.
        </p>

        <h1
          style={{
            lineHeight: "1.1",
            marginTop: "0rem",
            marginBottom: "1.25rem",
            fontFamily: "'Georgia', serif",
            color: "#FAF3E0",
            fontSize: "8rem",
            wordBreak: "break-word",
          }}
        >
          3,418,633,786
        </h1>

        <p
          style={{
            fontSize: "1.5rem",
            color: "#EAC46A",
            marginBottom: "0.75rem",
            lineHeight: "1.1",
          }}
        >
          of those pieces are suspected to be from bots.
        </p>

        <p style={{ marginTop: "6rem" }}>
          In this experience, we seek to investigate the behaviours of bots on
          Reddit that separate them from humans.
        </p>
      </div>

      <div
        style={{
          flex: "1 1 400px",
          minWidth: "300px",
          maxWidth: "600px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <PieChart
          data={[
            { label: "Spam/Bots", value: 3418633786 },
            { label: "Authentic Posts", value: 2526816278 },
          ]}
          width={600}
          height={600}
        />
      </div>
    </div>
  </main>
</section>
    )
}