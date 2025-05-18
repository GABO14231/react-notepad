--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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
-- Name: note_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.note_tags (
    note_id bigint NOT NULL,
    tag_id bigint NOT NULL,
    utag_id bigint NOT NULL
);


ALTER TABLE public.note_tags OWNER TO postgres;

--
-- Name: notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes (
    id_note bigint NOT NULL,
    note_owner bigint,
    note_title character varying,
    note_content text,
    note_color character varying(7)
);


ALTER TABLE public.notes OWNER TO postgres;

--
-- Name: notes_id_note_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notes_id_note_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notes_id_note_seq OWNER TO postgres;

--
-- Name: notes_id_note_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notes_id_note_seq OWNED BY public.notes.id_note;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id_tags bigint NOT NULL,
    tag_name character varying
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: tags_id_tags_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_tags_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_tags_seq OWNER TO postgres;

--
-- Name: tags_id_tags_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_tags_seq OWNED BY public.tags.id_tags;


--
-- Name: user_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_tags (
    id_utags bigint NOT NULL,
    user_id bigint,
    utag_name character varying
);


ALTER TABLE public.user_tags OWNER TO postgres;

--
-- Name: user_tags_id_utags_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_tags_id_utags_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_tags_id_utags_seq OWNER TO postgres;

--
-- Name: user_tags_id_utags_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_tags_id_utags_seq OWNED BY public.user_tags.id_utags;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id_user bigint NOT NULL,
    email character varying,
    username character varying,
    user_password character varying,
    first_name character varying,
    last_name character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_user_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_user_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_user_seq OWNER TO postgres;

--
-- Name: users_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_user_seq OWNED BY public.users.id_user;


--
-- Name: notes id_note; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes ALTER COLUMN id_note SET DEFAULT nextval('public.notes_id_note_seq'::regclass);


--
-- Name: tags id_tags; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id_tags SET DEFAULT nextval('public.tags_id_tags_seq'::regclass);


--
-- Name: user_tags id_utags; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tags ALTER COLUMN id_utags SET DEFAULT nextval('public.user_tags_id_utags_seq'::regclass);


--
-- Name: users id_user; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id_user SET DEFAULT nextval('public.users_id_user_seq'::regclass);


--
-- Data for Name: note_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.note_tags (note_id, tag_id, utag_id) FROM stdin;
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notes (id_note, note_owner, note_title, note_content, note_color) FROM stdin;
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id_tags, tag_name) FROM stdin;
\.


--
-- Data for Name: user_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_tags (id_utags, user_id, utag_name) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id_user, email, username, user_password, first_name, last_name) FROM stdin;
\.


--
-- Name: notes_id_note_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notes_id_note_seq', 1, false);


--
-- Name: tags_id_tags_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_tags_seq', 1, false);


--
-- Name: user_tags_id_utags_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_tags_id_utags_seq', 1, false);


--
-- Name: users_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_user_seq', 1, false);


--
-- Name: note_tags pk_note_tags; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note_tags
    ADD CONSTRAINT pk_note_tags PRIMARY KEY (note_id, utag_id, tag_id);


--
-- Name: notes pk_notes; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT pk_notes PRIMARY KEY (id_note);


--
-- Name: tags pk_tags; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT pk_tags PRIMARY KEY (id_tags);


--
-- Name: user_tags pk_user_tags; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tags
    ADD CONSTRAINT pk_user_tags PRIMARY KEY (id_utags);


--
-- Name: users pk_users; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT pk_users PRIMARY KEY (id_user);


--
-- Name: user_tags unq_user_tags; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tags
    ADD CONSTRAINT unq_user_tags UNIQUE (user_id, utag_name);


--
-- Name: idx_note_tags; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_note_tags ON public.tags USING btree (id_tags);


--
-- Name: idx_note_title; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_note_title ON public.notes USING btree (note_title);


--
-- Name: note_tags fk_note_tags_notes; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note_tags
    ADD CONSTRAINT fk_note_tags_notes FOREIGN KEY (note_id) REFERENCES public.notes(id_note) ON DELETE CASCADE;


--
-- Name: note_tags fk_note_tags_tags; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note_tags
    ADD CONSTRAINT fk_note_tags_tags FOREIGN KEY (tag_id) REFERENCES public.tags(id_tags) ON DELETE CASCADE;


--
-- Name: note_tags fk_note_tags_user_tags; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note_tags
    ADD CONSTRAINT fk_note_tags_user_tags FOREIGN KEY (utag_id) REFERENCES public.user_tags(id_utags) ON DELETE CASCADE;


--
-- Name: notes fk_notes_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fk_notes_users FOREIGN KEY (note_owner) REFERENCES public.users(id_user) ON DELETE CASCADE;


--
-- Name: user_tags fk_user_tags_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tags
    ADD CONSTRAINT fk_user_tags_users FOREIGN KEY (user_id) REFERENCES public.users(id_user) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--