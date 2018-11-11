--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.10
-- Dumped by pg_dump version 9.6.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: operate; Type: TABLE; Schema: public; Owner: andrey
--

CREATE TABLE public.operate (
    user_numbers integer
);


ALTER TABLE public.operate OWNER TO andrey;

--
-- Name: queue; Type: TABLE; Schema: public; Owner: andrey
--

CREATE TABLE public.queue (
    user_numbers integer
);


ALTER TABLE public.queue OWNER TO andrey;

--
-- Name: users; Type: TABLE; Schema: public; Owner: andrey
--

CREATE TABLE public.users (
    id integer NOT NULL,
    user_token uuid NOT NULL,
    first_name text,
    second_name text,
    third_name text,
    gender text,
    birthday bigint,
    born_place text,
    seria bigint,
    number bigint,
    issued_by text,
    issued_date bigint,
    issued_code text,
    live_address text,
    fact_address text,
    m_first_name text,
    m_second_name text,
    m_third_name text,
    m_birthday bigint,
    m_born_place text,
    m_address text,
    m_fact_address text,
    m_work text,
    f_first_name text,
    f_second_name text,
    f_third_name text,
    f_birthday bigint,
    f_born_place text,
    f_address text,
    f_fact_address text,
    f_work text,
    c_number text,
    c_issued_date bigint,
    c_school text
);


ALTER TABLE public.users OWNER TO andrey;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: andrey
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO andrey;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: andrey
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: andrey
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: operate; Type: TABLE DATA; Schema: public; Owner: andrey
--

COPY public.operate (user_numbers) FROM stdin;
\.


--
-- Data for Name: queue; Type: TABLE DATA; Schema: public; Owner: andrey
--

COPY public.queue (user_numbers) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: andrey
--

COPY public.users (id, user_token, first_name, second_name, third_name, gender, birthday, born_place, seria, number, issued_by, issued_date, issued_code, live_address, fact_address, m_first_name, m_second_name, m_third_name, m_birthday, m_born_place, m_address, m_fact_address, m_work, f_first_name, f_second_name, f_third_name, f_birthday, f_born_place, f_address, f_fact_address, f_work, c_number, c_issued_date, c_school) FROM stdin;
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: andrey
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: andrey
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_id_uindex; Type: INDEX; Schema: public; Owner: andrey
--

CREATE UNIQUE INDEX users_id_uindex ON public.users USING btree (id);


--
-- Name: users_token_uindex; Type: INDEX; Schema: public; Owner: andrey
--

CREATE UNIQUE INDEX users_token_uindex ON public.users USING btree (user_token);


--
-- PostgreSQL database dump complete
--

