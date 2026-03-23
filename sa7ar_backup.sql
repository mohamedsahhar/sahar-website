--
-- PostgreSQL database dump
--

\restrict KEyBEPZEa0qxzYOQW23YSK1WuwrOTTMPdi3CMEcXLDqwNpOyCf4RS1dB0S7fun1

-- Dumped from database version 17.8 (a284a84)
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Brand; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Brand" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Brand" OWNER TO neondb_owner;

--
-- Name: Brand_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."Brand_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Brand_id_seq" OWNER TO neondb_owner;

--
-- Name: Brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."Brand_id_seq" OWNED BY public."Brand".id;


--
-- Name: Device; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Device" (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "brandId" integer NOT NULL
);


ALTER TABLE public."Device" OWNER TO neondb_owner;

--
-- Name: Device_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."Device_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Device_id_seq" OWNER TO neondb_owner;

--
-- Name: Device_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."Device_id_seq" OWNED BY public."Device".id;


--
-- Name: RepairCase; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."RepairCase" (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    problem text NOT NULL,
    solution text NOT NULL,
    "repairTime" text,
    image text,
    "beforeImage" text,
    "afterImage" text,
    "videoUrl" text,
    "deviceId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RepairCase" OWNER TO neondb_owner;

--
-- Name: RepairCase_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."RepairCase_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RepairCase_id_seq" OWNER TO neondb_owner;

--
-- Name: RepairCase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."RepairCase_id_seq" OWNED BY public."RepairCase".id;


--
-- Name: Brand id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Brand" ALTER COLUMN id SET DEFAULT nextval('public."Brand_id_seq"'::regclass);


--
-- Name: Device id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Device" ALTER COLUMN id SET DEFAULT nextval('public."Device_id_seq"'::regclass);


--
-- Name: RepairCase id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."RepairCase" ALTER COLUMN id SET DEFAULT nextval('public."RepairCase_id_seq"'::regclass);


--
-- Data for Name: Brand; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Brand" (id, name) FROM stdin;
1	JBL
2	Apple
3	Samsung
4	Huawei
\.


--
-- Data for Name: Device; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Device" (id, name, slug, "brandId") FROM stdin;
1	partybox 110	partybox-110	1
2	iphone 13	iphone-13	2
3	MacBook Pro 2017	macbook-pro-2017	2
4	Samsung Galaxy S23 Ultra	samsung-galaxy-s23-ultra	3
6	Apple AirPods 1	apple-airpods-1	2
7	Apple AirPods 2	apple-airpods-2	2
8	Apple AirPods 3	apple-airpods-3	2
9	Apple AirPods 4	apple-airpods-4	2
10	Apple AirPods Pro 1	apple-airpods-pro-1	2
11	Apple AirPods Pro 2	apple-airpods-pro-2	2
5	Huawei FreeBuds Pro 2	huawei-freebuds-pro-2	4
12	Huawei FreeBuds Pro	huawei-freebuds-pro	4
\.


--
-- Data for Name: RepairCase; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."RepairCase" (id, title, slug, problem, solution, "repairTime", image, "beforeImage", "afterImage", "videoUrl", "deviceId", "createdAt", "updatedAt") FROM stdin;
1	jbl partybox 110 charge port problem 	jbl-partybox-110-charge-port-problem	charge port is damage	repair charge port	1 day	https://res.cloudinary.com/dft7jsjdv/image/upload/v1774151184/qm9ntzfdglkpljzdfloa.png	https://res.cloudinary.com/dft7jsjdv/image/upload/v1774151189/aqfxlwx5izs69z25zsu9.png	https://res.cloudinary.com/dft7jsjdv/image/upload/v1774151194/blh5a4d8ul9h4idhesax.png	https://www.instagram.com/reel/DRJf76hjIfq/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==	1	2026-03-22 03:48:59.306	2026-03-22 03:48:59.306
2	apple iphone 13 charge problem 	apple-iphone-13-charge-problem	the phone not charge at all 	charge port flex replacement 	2 hours	https://res.cloudinary.com/dft7jsjdv/image/upload/v1774151560/giscalpc5oo65g49qzh7.jpg	\N	\N	\N	2	2026-03-22 03:52:41.707	2026-03-22 03:52:41.707
3	Apple MacBook Pro 2017 Battery Replacement in Cairo	apple-macbook-pro-2017-battery-replacement-in-cairo	MacBook battery draining fast, not holding charge, and shutting down unexpectedly.	Replaced the old swollen battery with a new high-quality battery and tested performance to ensure stable power and proper charging.	2–3 hours	https://res.cloudinary.com/dft7jsjdv/image/upload/v1774193265/r4zpnxqesbbwckkvtxr3.png	https://res.cloudinary.com/dft7jsjdv/image/upload/v1774193274/exc8qlbcme3iuxau3b9x.png	https://res.cloudinary.com/dft7jsjdv/image/upload/v1774193279/sxzb7hqmxqanpd9unkyj.png	https://www.instagram.com/reel/DOzJRdzDPUW/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==	3	2026-03-22 15:28:21.177	2026-03-22 15:28:21.177
4	Samsung Galaxy S23 Ultra LCD Screen Replacement in Cairo	samsung-galaxy-s23-ultra-lcd-screen-replacement-in-cairo	Broken LCD screen, display not working properly, black screen or touch not responding.	Replaced the damaged LCD screen with a new high-quality display and tested touch functionality, brightness, and overall performance.	1–2 hours	https://res.cloudinary.com/dft7jsjdv/image/upload/v1774200654/ij6vam8b1jzjnuqgm4ej.jpg	https://res.cloudinary.com/dft7jsjdv/image/upload/v1774200659/ihmxfhweamjio1peezyo.jpg	https://res.cloudinary.com/dft7jsjdv/image/upload/v1774200663/arnpbyb8qsrcity1nnik.jpg	\N	4	2026-03-22 17:31:06.616	2026-03-22 17:31:06.616
5	Huawei FreeBuds Pro 2 Battery Replacement in Cairo	huawei-freebuds-pro-2-battery-replacement-in-cairo	Earbuds battery draining fast, not holding charge, or one side not working properly due to weak battery.	Replaced the internal batteries for Huawei FreeBuds Pro 2 and tested charging, sound performance, and battery stability.	2 days	https://res.cloudinary.com/dft7jsjdv/image/upload/v1774202335/jhpd999ysz544oczfrwi.jpg	\N	\N	\N	5	2026-03-22 17:59:00.402	2026-03-22 17:59:00.402
6	Apple AirPods 1 Battery Replacement in Cairo	apple-airpods-1-battery-replacement-in-cairo	AirPods battery draining quickly, not holding charge, or one side stopping working due to battery failure.	Replaced the internal batteries for Apple AirPods 1 and tested charging, sound quality, and battery performance to ensure stable operation.	8 hours	https://res.cloudinary.com/dft7jsjdv/image/upload/v1774203700/rge5wanknff809q2it7i.jpg	\N	\N	https://www.instagram.com/reel/C2Li-6mtw1x/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==	6	2026-03-22 18:21:55.934	2026-03-22 18:21:55.934
\.


--
-- Name: Brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."Brand_id_seq"', 4, true);


--
-- Name: Device_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."Device_id_seq"', 12, true);


--
-- Name: RepairCase_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."RepairCase_id_seq"', 6, true);


--
-- Name: Brand Brand_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_pkey" PRIMARY KEY (id);


--
-- Name: Device Device_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Device"
    ADD CONSTRAINT "Device_pkey" PRIMARY KEY (id);


--
-- Name: RepairCase RepairCase_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."RepairCase"
    ADD CONSTRAINT "RepairCase_pkey" PRIMARY KEY (id);


--
-- Name: Device_slug_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Device_slug_key" ON public."Device" USING btree (slug);


--
-- Name: RepairCase_slug_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "RepairCase_slug_key" ON public."RepairCase" USING btree (slug);


--
-- Name: Device Device_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Device"
    ADD CONSTRAINT "Device_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RepairCase RepairCase_deviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."RepairCase"
    ADD CONSTRAINT "RepairCase_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES public."Device"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict KEyBEPZEa0qxzYOQW23YSK1WuwrOTTMPdi3CMEcXLDqwNpOyCf4RS1dB0S7fun1

