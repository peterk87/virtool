import os
import sys
import shutil

import pytest

import virtool.jobs.analysis
import virtool.jobs.pathoscope

TEST_FILES_PATH = os.path.join(sys.path[0], "tests", "test_files")
FASTQ_PATH = os.path.join(TEST_FILES_PATH, "test.fq")


@pytest.fixture
def mock_job(tmpdir, mocker, request, dbs, test_db_connection_string, test_db_name, otu_resource):
    # Add sample path.
    tmpdir.mkdir("samples").mkdir("foobar").mkdir("analysis")

    # Copy read files.
    shutil.copyfile(FASTQ_PATH, os.path.join(str(tmpdir), "samples", "foobar", "reads_1.fq"))

    settings = {
        "data_path": str(tmpdir),
        "db_name": test_db_name
    }

    sequence_otu_map, _ = otu_resource

    dbs.jobs.insert_one({
        "_id": "foobar",
        "task": "pathoscope_bowtie",
        "args": {
            "sample_id": "foobar",
            "analysis_id": "baz",
            "ref_id": "original",
            "index_id": "index3"
        },
        "proc": 2,
        "mem": 8
    })

    dbs.indexes.insert_one({
        "_id": "index3",
        "manifest": {
            "foobar": 10,
            "reo": 5,
            "baz": 6
        },
        "sequence_otu_map": sequence_otu_map
    })

    queue = mocker.Mock()

    job = virtool.jobs.pathoscope.Job(
        test_db_connection_string,
        test_db_name,
        settings,
        "foobar",
        queue
    )

    job.init_db()

    return job
