import React, { useEffect, useState } from "react";
import {
  Typography,
  Input,
  Button,
  Row,
  Col,
  Space,
  Skeleton,
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import {
  Search as SearchIcon,
  PlusCircle,
  ArrowRight,
  Fingerprint,
  Tag,
  Clock,
  Users,
  MapPinned,
} from "lucide-react";
import { itemService } from "../../services/itemService";
import type { Item } from "../../types/item";
import ItemCard from "../../components/items/ItemCard";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const { Title, Paragraph, Text } = Typography;

/**
 * ───────────────────────────────────────────────────────────
 *  DESIGN TOKENS — "Lost Property Office" identity
 *  A claim-ticket / ledger aesthetic: paper, ink, brass grommets,
 *  and the red/green tag colours real baggage-claim desks use to
 *  separate LOST from FOUND at a glance.
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const paperDeep = "#E2D8C1"; // recessed paper (skeletons, wells)
const claimRed = "#A23E2E";  // LOST tag
const claimGreen = "#3E6C52"; // FOUND tag
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

// A faint crosshatch, like the underside of a manila folder
const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [searchVal, setSearchVal] = useState<string>("");

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        setIsLoading(true);
        const items = await itemService.getItems({ status: "OPEN" });
        setRecentItems(items.slice(0, 4));
      } catch (err) {
        console.error("Failed to load recent items:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  const handleSearchSubmit = () => {
    if (searchVal.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate("/items");
    }
  };

  // Alternate tag colour + tilt per ticket, so the board reads as
  // hand-filed rather than machine-stamped.
  const ticketTint = (i: number) => (i % 2 === 0 ? claimRed : claimGreen);
  const ticketTilt = (i: number) => ["-1.4deg", "0.9deg", "-0.7deg", "1.3deg"][i % 4];

  return (
    <div style={{ width: "100%", fontFamily: bodyFont, backgroundColor: paper }}>
      {/* 1. HERO — the registry desk */}
      <section
        style={{
          position: "relative",
          backgroundColor: paper,
          backgroundImage: paperTexture,
          padding: "96px 24px 88px 24px",
          borderTop: `6px solid ${ink}`,
          borderBottom: `6px solid ${ink}`,
        }}
      >
        <div style={{ maxWidth: "880px", margin: "0 auto", position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: monoFont,
              fontSize: "12px",
              letterSpacing: "1.5px",
              color: inkSoft,
              textTransform: "uppercase",
              marginBottom: "28px",
              paddingBottom: "6px",
              borderBottom: `1px dashed ${inkSoft}`,
            }}
          >
            <Tag size={13} />
            Registry File No. 001 — Community Lost &amp; Found
          </div>

          <Title
            level={1}
            style={{
              fontFamily: displayFont,
              fontSize: "58px",
              fontWeight: 700,
              color: ink,
              marginBottom: "22px",
              lineHeight: 1.08,
              letterSpacing: "-0.5px",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: claimRed }}>Lost</span> something?
            <br />
            <span style={{ color: claimGreen }}>Found</span> something?
          </Title>

          <Paragraph
            style={{
              fontFamily: bodyFont,
              fontSize: "18px",
              color: inkSoft,
              marginBottom: "40px",
              lineHeight: 1.65,
              maxWidth: "620px",
            }}
          >
            <strong style={{ color: ink }}>Unstray</strong> is a community
            claim desk for your neighbourhood — file a report, search open
            cases, and get matched with what's yours.
          </Paragraph>

          {/* CLAIM DESK SEARCH SLOT */}
          <div
            style={{
              maxWidth: "620px",
              margin: "0 0 40px 0",
              backgroundColor: paperLight,
              border: `2px solid ${ink}`,
              padding: "6px",
              display: "flex",
              boxShadow: `4px 4px 0px ${ink}`,
            }}
          >
            <Input
              size="large"
              placeholder="describe the item — phone, wallet, keys, backpack..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onPressEnter={handleSearchSubmit}
              prefix={
                <SearchIcon size={18} style={{ color: ink, marginRight: "8px" }} />
              }
              bordered={false}
              style={{
                fontFamily: monoFont,
                fontSize: "14px",
                color: ink,
              }}
            />
            <Button
              onClick={handleSearchSubmit}
              style={{
                fontFamily: monoFont,
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "12px",
                height: "44px",
                padding: "0 22px",
                background: ink,
                color: paperLight,
                border: "none",
                borderRadius: 0,
                flexShrink: 0,
              }}
            >
              Search File
            </Button>
          </div>

          {/* ACTION STAMPS */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", alignItems: "center" }}>
            <Link to="/report/lost">
              <button
                style={{
                  fontFamily: displayFont,
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: "14px 28px",
                  background: "transparent",
                  color: claimRed,
                  border: `2px solid ${claimRed}`,
                  cursor: "pointer",
                  transform: "rotate(-1.5deg)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <PlusCircle size={17} /> Report Lost
              </button>
            </Link>
            <Link to="/report/found">
              <button
                style={{
                  fontFamily: displayFont,
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: "14px 28px",
                  background: "transparent",
                  color: claimGreen,
                  border: `2px solid ${claimGreen}`,
                  cursor: "pointer",
                  transform: "rotate(1deg)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <PlusCircle size={17} /> Report Found
              </button>
            </Link>
            <Link
              to="/items"
              style={{
                fontFamily: monoFont,
                fontSize: "13px",
                letterSpacing: "0.5px",
                color: ink,
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Browse the full registry <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. RECENTLY FILED — claim ticket board */}
      <section style={{ maxWidth: "1240px", margin: "0 auto", padding: "76px 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "16px",
            borderBottom: `2px solid ${ink}`,
            paddingBottom: "16px",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: monoFont,
                fontSize: "12px",
                fontWeight: 600,
                color: inkSoft,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Open Cases
            </span>
            <Title
              level={2}
              style={{
                fontFamily: displayFont,
                margin: "4px 0 0 0",
                fontWeight: 700,
                color: ink,
                textTransform: "uppercase",
                letterSpacing: "-0.5px",
              }}
            >
              Recently Filed
            </Title>
          </div>
          <Link
            to="/items"
            style={{
              fontFamily: monoFont,
              fontWeight: 600,
              color: ink,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <Row gutter={[24, 32]}>
            {[1, 2, 3, 4].map((n) => (
              <Col key={n} xs={24} sm={12} lg={6}>
                <div style={{ background: paperDeep, padding: "16px", border: `1px solid ${paperDeep}` }}>
                  <Skeleton.Image style={{ width: "100%", height: "170px" }} active />
                  <Skeleton active paragraph={{ rows: 2 }} style={{ marginTop: "12px" }} />
                </div>
              </Col>
            ))}
          </Row>
        ) : hasError ? (
          <ErrorState message="Could not fetch recently reported items. Make sure API Gateway is accessible or mock mode is toggled." />
        ) : recentItems.length === 0 ? (
          <EmptyState
            message="No open cases on file right now."
            actionText="Report an Item"
            onAction={() => navigate("/report/lost")}
          />
        ) : (
          <Row gutter={[28, 40]}>
            {recentItems.map((item, i) => (
              <Col key={item.id} xs={24} sm={12} lg={6}>
                <div
                  style={{
                    position: "relative",
                    background: paperLight,
                    border: `1px solid ${ink}`,
                    borderLeft: `6px solid ${ticketTint(i)}`,
                    transform: `rotate(${ticketTilt(i)})`,
                    transition: "transform 0.2s ease",
                  }}
                >
                  {/* grommet */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "12px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      border: `2px solid ${brass}`,
                      background: paper,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: monoFont,
                      fontSize: "11px",
                      color: inkSoft,
                      padding: "8px 14px 6px 14px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    NO. {String(item.id).padStart(5, "0").slice(-5)}
                  </div>
                  <div style={{ borderTop: `1px dashed ${paperDeep}`, padding: "12px" }}>
                    <ItemCard item={item} />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* 3. HOW IT WORKS — the filing process (numbered: it's a real sequence) */}
      <section
        style={{
          backgroundColor: ink,
          padding: "88px 24px",
        }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span
              style={{
                fontFamily: monoFont,
                fontSize: "12px",
                fontWeight: 600,
                color: "#9FB0AE",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              The Filing Process
            </span>
            <Title
              level={2}
              style={{
                fontFamily: displayFont,
                fontWeight: 700,
                color: paperLight,
                marginTop: "6px",
                textTransform: "uppercase",
                letterSpacing: "-0.5px",
              }}
            >
              How Unstray Works
            </Title>
          </div>

          <Row gutter={[0, 32]}>
            {[
              {
                num: "01",
                icon: <PlusCircle size={22} />,
                title: "File a Ticket",
                copy: "Post an item with its location, category, and a clear photo — the more detail, the faster it's matched.",
              },
              {
                num: "02",
                icon: <SearchIcon size={22} />,
                title: "Search the Registry",
                copy: "Filter open cases by location and category, or search the description in your own words.",
              },
              {
                num: "03",
                icon: <Fingerprint size={22} />,
                title: "Verify & Reclaim",
                copy: "Connect through a verified account, confirm ownership details, and close the case once it's handed back.",
              },
            ].map((step, idx) => (
              <Col xs={24} md={8} key={step.num}>
                <div
                  style={{
                    padding: "0 28px",
                    borderLeft: idx > 0 ? "1px dashed rgba(248,244,233,0.25)" : "none",
                    minHeight: "180px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: monoFont,
                      fontSize: "13px",
                      color: brass,
                      letterSpacing: "1px",
                      marginBottom: "14px",
                    }}
                  >
                    {step.num} / 03
                  </div>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      border: `2px solid ${paperLight}`,
                      color: paperLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "18px",
                    }}
                  >
                    {step.icon}
                  </div>
                  <Title
                    level={4}
                    style={{
                      fontFamily: displayFont,
                      fontWeight: 700,
                      color: paperLight,
                      marginBottom: "8px",
                    }}
                  >
                    {step.title}
                  </Title>
                  <Paragraph
                    style={{
                      fontFamily: bodyFont,
                      color: "#B8C4C1",
                      fontSize: "14px",
                      lineHeight: 1.65,
                      marginBottom: 0,
                    }}
                  >
                    {step.copy}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 4. WHY CHOOSE Unstray */}
      <section style={{ maxWidth: "1240px", margin: "0 auto", padding: "96px 24px" }}>
        <Row gutter={[56, 40]} align="middle">
          <Col xs={24} md={11}>
            <div
              style={{
                width: "100%",
                border: `2px solid ${ink}`,
                boxShadow: `8px 8px 0px ${paperDeep}`,
                overflow: "hidden",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80"
                alt="Community members reviewing a lost and found registry"
                style={{ width: "100%", display: "block", objectFit: "cover", filter: "grayscale(15%)" }}
              />
            </div>
          </Col>
          <Col xs={24} md={13}>
            <span
              style={{
                fontFamily: monoFont,
                fontSize: "12px",
                fontWeight: 600,
                color: inkSoft,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Why File With Us
            </span>
            <Title
              level={2}
              style={{
                fontFamily: displayFont,
                fontWeight: 700,
                color: ink,
                marginTop: "6px",
                marginBottom: "18px",
                textTransform: "uppercase",
                letterSpacing: "-0.5px",
              }}
            >
              Built like a proper claim desk
            </Title>
            <Paragraph
              style={{
                fontFamily: bodyFont,
                fontSize: "16px",
                color: inkSoft,
                lineHeight: 1.7,
                marginBottom: "32px",
              }}
            >
              No more scattered flyers on a noticeboard. Every report is
              logged, searchable, and closed out properly once it's back in
              the right hands.
            </Paragraph>

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {[
                {
                  icon: <Fingerprint size={20} />,
                  tint: claimRed,
                  title: "Verified filers only",
                  copy: "Every report is tied to a verified account, so claims can be trusted on both sides of the desk.",
                },
                {
                  icon: <Clock size={20} />,
                  tint: claimGreen,
                  title: "Cases close themselves out",
                  copy: "Statuses update the moment an item is claimed — no stale listings left open.",
                },
                {
                  icon: <MapPinned size={20} />,
                  tint: brass,
                  title: "Filed by neighbourhood",
                  copy: "Search narrows to campuses, transit hubs, and local areas so results are actually nearby.",
                },
              ].map((row) => (
                <div key={row.title} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      color: row.tint,
                      border: `2px solid ${row.tint}`,
                      padding: "9px",
                      display: "flex",
                      flexShrink: 0,
                    }}
                  >
                    {row.icon}
                  </div>
                  <div>
                    <Text strong style={{ fontFamily: displayFont, fontSize: "17px", color: ink }}>
                      {row.title}
                    </Text>
                    <Paragraph
                      style={{
                        fontFamily: bodyFont,
                        color: inkSoft,
                        margin: "4px 0 0 0",
                        fontSize: "14px",
                        lineHeight: 1.6,
                      }}
                    >
                      {row.copy}
                    </Paragraph>
                  </div>
                </div>
              ))}
            </Space>
          </Col>
        </Row>
      </section>

      {/* 5. CLOSING — final stamp */}
      <section
        style={{
          backgroundColor: paperLight,
          borderTop: `6px solid ${ink}`,
          padding: "76px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: monoFont,
              fontSize: "12px",
              letterSpacing: "1.5px",
              color: inkSoft,
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            <Users size={13} /> Join the registry
          </div>
          <Title
            level={2}
            style={{
              fontFamily: displayFont,
              color: ink,
              fontWeight: 700,
              fontSize: "34px",
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "-0.5px",
            }}
          >
            Misplaced something?
          </Title>
          <Paragraph
            style={{
              fontFamily: bodyFont,
              color: inkSoft,
              fontSize: "16px",
              marginBottom: "36px",
              lineHeight: 1.65,
            }}
          >
            File it in under a minute. The sooner it's on record, the sooner
            someone can hand it back.
          </Paragraph>
          <Space size="middle" wrap>
            <Link to="/report/lost">
              <button
                style={{
                  fontFamily: displayFont,
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: "15px 32px",
                  background: claimRed,
                  color: paperLight,
                  border: `2px solid ${claimRed}`,
                  cursor: "pointer",
                }}
              >
                Start a Lost Report
              </button>
            </Link>
            <Link to="/items">
              <button
                style={{
                  fontFamily: displayFont,
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: "15px 32px",
                  background: "transparent",
                  color: ink,
                  border: `2px solid ${ink}`,
                  cursor: "pointer",
                }}
              >
                Browse the Registry
              </button>
            </Link>
          </Space>
        </div>
      </section>
    </div>
  );
};

export default Home;