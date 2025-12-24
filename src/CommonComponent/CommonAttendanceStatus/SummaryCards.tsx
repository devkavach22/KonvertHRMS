interface SummaryCard {
  icon: string;
  bg: string;
  title: string;
  value: string;
  total: string;
  trend: string;
  trendType: "up" | "down";
}

interface Props {
  cards: SummaryCard[];
}

const SummaryCards = ({ cards }: Props) => {
  return (
    <>
      {cards.map((card, index) => (
        <div className="col-xl-3 col-md-6" key={index}>
          <div className="card">
            <div className="card-body">
              <div className="border-bottom mb-2 pb-2">
                <span className={`avatar avatar-sm bg-${card.bg} mb-2`}>
                  <i className={card.icon} />
                </span>

                <h2 className="mb-2">
                  {card.value} /{" "}
                  <span className="fs-20 text-gray-5">{card.total}</span>
                </h2>

                <p className="fw-medium text-truncate">{card.title}</p>
              </div>

              <p className="d-flex align-items-center fs-13">
                <span
                  className={`avatar avatar-xs rounded-circle bg-${
                    card.trendType === "up" ? "success" : "danger"
                  } me-2`}
                >
                  <i
                    className={`ti ${
                      card.trendType === "up" ? "ti-arrow-up" : "ti-arrow-down"
                    } fs-12`}
                  />
                </span>
                <span>{card.trend}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SummaryCards;
