

export const InfoCard = ({Icon, title, subtitle, text}) => {
    return(
        <div style={{
            backgroundColor: "#1E1005",
            border: "1px solid #2E1A08",
            borderRadius: "6px",
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}>
            {/* Some sort of svg icon */}
            <div style={{ height: "100px", width: "100px"}}>
            <Icon />
            </div>

            <div>
              <div style={{ fontSize: "52px", fontWeight: "800", color: "#C4622D", lineHeight: 1, fontFamily: "'Georgia', serif", textAlign: "left"}}>{title}</div>
              <div style={{ fontSize: "22px", letterSpacing: "2px", color: "#FAF3E0", marginTop: "4px", textAlign: "left"}}>{subtitle}</div>
              <div style={{ fontSize: "20px", color: "#EAC46A", marginTop: "3px", letterSpacing: "0.5px", textAlign: "left" }}>{text}</div>
            </div>
          </div>
    )
}