import { formatINR } from "../utils/format";

export default function EmiPlanList({ plans, selectedPlanId, onSelect }) {
  return (
    <div className="emi-plan-list">
      <div className="emi-plan-header">
        <h2>EMI plans</h2>
        <span className="emi-plan-subtitle">Backed by mutual funds</span>
      </div>

      <div className="emi-plan-rows">
        {plans.map((plan) => {
          const isSelected = plan.id === selectedPlanId;

          return (
            <label
              key={plan.id}
              className={isSelected ? "emi-plan-row selected" : "emi-plan-row"}
            >
              <div className="emi-plan-left">
                <input
                  type="radio"
                  name="emi-plan"
                  checked={isSelected}
                  onChange={() => onSelect(plan.id)}
                />

                <div>
                  <p className="emi-plan-amount">
                    {formatINR(plan.monthlyAmount)}
                    <span className="emi-plan-tenure"> x {plan.tenureMonths} months</span>
                  </p>

                  {plan.cashbackAmount > 0 && (
                    <p className="emi-plan-cashback">
                      Additional cashback of {formatINR(plan.cashbackAmount)}
                    </p>
                  )}
                </div>
              </div>
              <div className="emi-plan-right">
                {plan.isRecommended && <span className="emi-plan-tag">POPULAR</span>}

                <span
                  className={plan.interestRate === 0 ? "emi-plan-rate zero" : "emi-plan-rate"}
                >
                  {plan.interestRate === 0 ? "0% interest" : `${plan.interestRate}% interest`}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}